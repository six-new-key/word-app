#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CET 单词数据导入脚本（通用表结构版）
自动从文件名提取类别（如 cet4.json -> category=cet4）
支持字段：基础字段 + 新增字段（phone, star, picture, speech, realExamSentence, remMethod）
"""

import json
import os
import pymysql
from pymysql.err import OperationalError, ProgrammingError, IntegrityError
from typing import Dict, List, Any, Optional, Tuple

# -------------------------- 【仅需修改这2处配置！】 --------------------------
# 1. MySQL连接配置（填你的实际信息）
MYSQL_CONFIG = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "swx020708",  # ⚠️ 改成你的真实密码
    "database": "word_origin",
    "charset": "utf8mb4"
}

# 2. JSON文件路径列表（自动从文件名提取类别，如 cet4.json -> category=cet4）
# 支持多个文件，每个文件会提取自己的类别分别导入
JSON_FILE_PATHS = [
    r"D:\github\cet-word-api\data\CET4.json",
    r"D:\github\cet-word-api\data\CET6.json",
    r"D:\github\cet-word-api\data\KaoYan.json",
    # r"D:\data\考研.json",
    # r"D:\data\雅思.json",
    # r"D:\data\高中.json",
    # r"D:\data\初中.json",
]

# -------------------------- 无需修改的核心逻辑 --------------------------


def extract_category_from_filename(file_path: str) -> str:
    """
    从文件路径提取类别
    例如：D:\data\CET4.json -> cet4
          D:\data\考研.json -> 考研
          D:\data\CET-6_luan_1.json -> cet-6_luan_1
    """
    # 获取文件名（不含路径）
    filename = os.path.basename(file_path)
    # 去掉扩展名
    name_without_ext = os.path.splitext(filename)[0]
    # 转换为小写（可选，如果你希望类别统一小写）
    # category = name_without_ext.lower()
    # 或者保持原样
    category = name_without_ext
    
    print(f"📁 文件：{filename} -> 类别：{category}")
    return category


def replace_french_chars(text: Any) -> Any:
    """替换法语特殊字母，避免乱码/入库失败"""
    if not text or not isinstance(text, str):
        return text
    
    replace_map = {
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e', 'ç': 'c',
        'à': 'a', 'â': 'a', 'ô': 'o', 'û': 'u', 'ï': 'i',
        'ü': 'u', 'î': 'i', 'ÿ': 'y'
    }
    for fr_char, en_char in replace_map.items():
        text = text.replace(fr_char, en_char)
    return text


def safe_get(data: Dict, key: str, default: Any = "") -> Any:
    """安全获取字典值，处理None和非字典情况"""
    if not isinstance(data, dict):
        return default
    return data.get(key, default)


def safe_get_nested(data: Dict, *keys: str, default: Any = None) -> Any:
    """安全获取嵌套字典值，任意层级不存在时返回default"""
    current = data
    for key in keys:
        if not isinstance(current, dict):
            return default
        current = current.get(key, default)
        if current is None:
            return default
    return current


def parse_word_json(file_path: str, category: str) -> List[Dict]:
    """
    逐行解析JSON Lines格式的单词文件
    兼容新旧JSON结构，缺失字段自动填充默认值
    """
    parsed_words = []
    line_num = 0
    
    try:
        with open(file_path, "r", encoding="utf8") as f:
            for line in f:
                line_num += 1
                line = line.strip()
                if not line:
                    continue
                
                try:
                    word = json.loads(line)
                    
                    # 1. 基础字段（新旧JSON都有）
                    word_rank = safe_get(word, "wordRank", 0)
                    head_word = replace_french_chars(safe_get(word, "headWord", ""))
                    book_id = safe_get(word, "bookId", "")
                    
                    # 2. 嵌套结构解析（带完整容错）
                    content = safe_get(word, "content", {})
                    word_detail = safe_get(content, "word", {})
                    word_inner_content = safe_get(word_detail, "content", {})
                    
                    # 3. 主表基础字段（新旧JSON都有）
                    word_head = safe_get(word_detail, "wordHead", "")
                    word_id = safe_get(word_detail, "wordId", "")
                    us_phone = safe_get(word_inner_content, "usphone", "")
                    uk_phone = safe_get(word_inner_content, "ukphone", "")
                    us_speech = safe_get(word_inner_content, "usspeech", "")
                    uk_speech = safe_get(word_inner_content, "ukspeech", "")
                    
                    # 4. 【新增字段】兼容处理（新JSON有，旧JSON没有）
                    phone = safe_get(word_inner_content, "phone", "")
                    star = safe_get(word_inner_content, "star", 0)
                    picture = safe_get(word_inner_content, "picture", "")
                    speech = safe_get(word_inner_content, "speech", "")
                    
                    # 5. 子表数据解析（全部使用安全获取）
                    trans_list = safe_get(word_inner_content, "trans", [])
                    exam_list = safe_get(word_inner_content, "exam", [])
                    sentence_obj = safe_get(word_inner_content, "sentence", {})
                    syno_obj = safe_get(word_inner_content, "syno", {})
                    phrase_obj = safe_get(word_inner_content, "phrase", {})
                    rel_word_obj = safe_get(word_inner_content, "relWord", {})
                    
                    # 6. 【新增子表】真题例句（新JSON有，旧JSON没有）
                    real_exam_sentence_obj = safe_get(word_inner_content, "realExamSentence", {})
                    
                    # 7. 【新增子表】记忆方法（新JSON有，旧JSON没有）
                    rem_method_obj = safe_get(word_inner_content, "remMethod", {})
                    
                    parsed_words.append({
                        'category': category,  # 从文件名提取的类别
                        'word_rank': word_rank,
                        'head_word': head_word,
                        'book_id': book_id,
                        'word_head': word_head,
                        'word_id': word_id,
                        'us_phone': us_phone,
                        'uk_phone': uk_phone,
                        'us_speech': us_speech,
                        'uk_speech': uk_speech,
                        # 新增字段
                        'phone': phone,
                        'star': star if star else 0,
                        'picture': picture,
                        'speech': speech,
                        # 子表数据
                        'trans': trans_list if isinstance(trans_list, list) else [],
                        'exams': exam_list if isinstance(exam_list, list) else [],
                        'sentence': sentence_obj if isinstance(sentence_obj, dict) else {},
                        'syno': syno_obj if isinstance(syno_obj, dict) else {},
                        'phrase': phrase_obj if isinstance(phrase_obj, dict) else {},
                        'rel_word': rel_word_obj if isinstance(rel_word_obj, dict) else {},
                        # 新增子表
                        'real_exam_sentence': real_exam_sentence_obj if isinstance(real_exam_sentence_obj, dict) else {},
                        'rem_method': rem_method_obj if isinstance(rem_method_obj, dict) else {}
                    })
                    
                except json.JSONDecodeError as e:
                    print(f"⚠️  第{line_num}行JSON解析失败：{str(e)}，已跳过")
                except Exception as e:
                    print(f"⚠️  第{line_num}行数据处理失败：{str(e)}，已跳过")
                    
        print(f"✅  文件解析完成：{file_path}，共解析出{len(parsed_words)}条有效单词数据")
        return parsed_words
        
    except FileNotFoundError:
        print(f"❌  未找到JSON文件：{file_path}")
        return []
    except PermissionError:
        print(f"❌  无权限读取JSON文件：{file_path}")
        return []
    except Exception as e:
        print(f"❌  文件读取失败：{file_path}，错误：{str(e)}")
        return []


def insert_word_to_mysql(conn, cursor, word_data: Dict) -> bool:
    """
    插入单个单词及其所有关联数据到数据库（通用表结构）
    包含完整的事务处理和错误回滚
    """
    
    try:
        # ==================== 1. 插入主表（新增category字段）====================
        insert_main_sql = """
            INSERT INTO words (
                category, word_rank, head_word, book_id, word_head, word_id,
                us_phone, uk_phone, us_speech, uk_speech,
                phone, star, picture, speech
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                word_rank=VALUES(word_rank),
                word_head=VALUES(word_head),
                word_id=VALUES(word_id),
                us_phone=VALUES(us_phone),
                uk_phone=VALUES(uk_phone),
                us_speech=VALUES(us_speech),
                uk_speech=VALUES(uk_speech),
                phone=VALUES(phone),
                star=VALUES(star),
                picture=VALUES(picture),
                speech=VALUES(speech);
        """
        
        cursor.execute(insert_main_sql, (
            word_data['category'],  # 新增：类别字段
            word_data['word_rank'], 
            word_data['head_word'], 
            word_data['book_id'],
            word_data['word_head'], 
            word_data['word_id'],
            word_data['us_phone'], 
            word_data['uk_phone'],
            word_data['us_speech'], 
            word_data['uk_speech'],
            word_data['phone'], 
            word_data['star'], 
            word_data['picture'], 
            word_data['speech']
        ))
        
        # 获取主表ID（处理插入或更新情况）
        main_id = cursor.lastrowid
        if main_id == 0:
            # 更新操作，需要查询ID（带上category条件确保准确）
            cursor.execute("""
                SELECT id FROM words 
                WHERE category = %s AND head_word = %s AND book_id = %s
            """, (word_data['category'], word_data['head_word'], word_data['book_id']))
            result = cursor.fetchone()
            if result:
                main_id = result[0]
            else:
                raise Exception("无法获取主表ID")
        
        # ==================== 2. 插入翻译表 ====================
        if word_data['trans']:
            insert_trans_sql = """
                INSERT INTO word_trans (
                    word_main_id, pos, tran_cn, tran_other, desc_cn, desc_other
                ) VALUES (%s, %s, %s, %s, %s, %s);
            """
            trans_values = []
            for trans in word_data['trans']:
                if not isinstance(trans, dict):
                    continue
                trans_values.append((
                    main_id,
                    safe_get(trans, "pos", ""),
                    safe_get(trans, "tranCn", ""),
                    safe_get(trans, "tranOther", ""),
                    safe_get(trans, "descCn", ""),
                    safe_get(trans, "descOther", "")
                ))
            if trans_values:
                cursor.executemany(insert_trans_sql, trans_values)
        
        # ==================== 3. 插入例句表 ====================
        sentences = safe_get(word_data['sentence'], "sentences", [])
        if sentences:
            insert_sent_sql = """
                INSERT INTO word_sentences (
                    word_main_id, s_content, s_cn, sent_desc
                ) VALUES (%s, %s, %s, %s);
            """
            sent_values = []
            sent_desc = safe_get(word_data['sentence'], "desc", "例句")
            for sent in sentences:
                if not isinstance(sent, dict):
                    continue
                sent_values.append((
                    main_id,
                    safe_get(sent, "sContent", ""),
                    safe_get(sent, "sCn", ""),
                    sent_desc
                ))
            if sent_values:
                cursor.executemany(insert_sent_sql, sent_values)
        
        # ==================== 4. 插入真题例句表 ====================
        real_exam_sentences = safe_get(word_data['real_exam_sentence'], "sentences", [])
        if real_exam_sentences:
            insert_real_exam_sql = """
                INSERT INTO word_real_exam_sentences (
                    word_main_id, s_content, paper, level, year, type, real_exam_desc
                ) VALUES (%s, %s, %s, %s, %s, %s, %s);
            """
            real_exam_values = []
            real_exam_desc = safe_get(word_data['real_exam_sentence'], "desc", "真题例句")
            
            for sent in real_exam_sentences:
                if not isinstance(sent, dict):
                    continue
                source_info = safe_get(sent, "sourceInfo", {})
                real_exam_values.append((
                    main_id,
                    safe_get(sent, "sContent", ""),
                    safe_get(source_info, "paper", ""),
                    safe_get(source_info, "level", ""),
                    safe_get(source_info, "year", ""),
                    safe_get(source_info, "type", ""),
                    real_exam_desc
                ))
            if real_exam_values:
                cursor.executemany(insert_real_exam_sql, real_exam_values)
        
        # ==================== 5. 插入短语表 ====================
        phrases = safe_get(word_data['phrase'], "phrases", [])
        if phrases:
            insert_phrase_sql = """
                INSERT INTO word_phrases (
                    word_main_id, p_content, p_cn, phrase_desc
                ) VALUES (%s, %s, %s, %s);
            """
            phrase_values = []
            phrase_desc = safe_get(word_data['phrase'], "desc", "短语")
            for phrase in phrases:
                if not isinstance(phrase, dict):
                    continue
                phrase_values.append((
                    main_id,
                    safe_get(phrase, "pContent", ""),
                    safe_get(phrase, "pCn", ""),
                    phrase_desc
                ))
            if phrase_values:
                cursor.executemany(insert_phrase_sql, phrase_values)
        
        # ==================== 6. 插入同近义词表 ====================
        synos = safe_get(word_data['syno'], "synos", [])
        if synos:
            insert_syno_sql = """
                INSERT INTO word_synos (
                    word_main_id, pos, syno_tran, syno_word, syno_desc
                ) VALUES (%s, %s, %s, %s, %s);
            """
            syno_values = []
            syno_desc = safe_get(word_data['syno'], "desc", "同近")
            
            for syno in synos:
                if not isinstance(syno, dict):
                    continue
                pos = safe_get(syno, "pos", "")
                tran = safe_get(syno, "tran", "")
                hwds = safe_get(syno, "hwds", [])
                
                for hwd in hwds:
                    if isinstance(hwd, dict):
                        syno_values.append((
                            main_id, pos, tran, 
                            safe_get(hwd, "w", ""), 
                            syno_desc
                        ))
            if syno_values:
                cursor.executemany(insert_syno_sql, syno_values)
        
        # ==================== 7. 插入同根词表 ====================
        rels = safe_get(word_data['rel_word'], "rels", [])
        if rels:
            insert_root_sql = """
                INSERT INTO word_roots (
                    word_main_id, pos, root_word, root_tran, root_desc
                ) VALUES (%s, %s, %s, %s, %s);
            """
            root_values = []
            root_desc = safe_get(word_data['rel_word'], "desc", "同根")
            
            for rel in rels:
                if not isinstance(rel, dict):
                    continue
                pos = safe_get(rel, "pos", "")
                words = safe_get(rel, "words", [])
                
                for w in words:
                    if isinstance(w, dict):
                        root_values.append((
                            main_id, pos, 
                            safe_get(w, "hwd", ""), 
                            safe_get(w, "tran", ""), 
                            root_desc
                        ))
            if root_values:
                cursor.executemany(insert_root_sql, root_values)
        
        # ==================== 8. 插入记忆方法表 ====================
        if word_data['rem_method']:
            insert_rem_sql = """
                INSERT INTO word_rem_methods (
                    word_main_id, val, `desc`
                ) VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    val=VALUES(val),
                    `desc`=VALUES(`desc`);
            """
            cursor.execute(insert_rem_sql, (
                main_id,
                safe_get(word_data['rem_method'], "val", ""),
                safe_get(word_data['rem_method'], "desc", "记忆")
            ))
        
        # ==================== 9. 插入测试题及选项 ====================
        exams = word_data['exams']
        if exams:
            insert_exam_sql = """
                INSERT INTO word_exams (
                    word_main_id, question, exam_type, right_index, answer_explain
                ) VALUES (%s, %s, %s, %s, %s);
            """
            insert_choice_sql = """
                INSERT INTO word_exam_choices (
                    exam_main_id, choice_index, choice_content
                ) VALUES (%s, %s, %s);
            """
            
            for exam in exams:
                if not isinstance(exam, dict):
                    continue
                    
                answer = safe_get(exam, "answer", {})
                cursor.execute(insert_exam_sql, (
                    main_id,
                    safe_get(exam, "question", ""),
                    safe_get(exam, "examType", 0),
                    safe_get(answer, "rightIndex", 0),
                    safe_get(answer, "explain", "")
                ))
                exam_id = cursor.lastrowid
                
                # 插入选项
                choices = safe_get(exam, "choices", [])
                if choices and exam_id:
                    choice_values = []
                    for choice in choices:
                        if isinstance(choice, dict):
                            choice_values.append((
                                exam_id,
                                safe_get(choice, "choiceIndex", 0),
                                safe_get(choice, "choice", "")
                            ))
                    if choice_values:
                        cursor.executemany(insert_choice_sql, choice_values)
        
        return True
        
    except Exception as e:
        print(f"❌  插入单词 '{word_data.get('head_word', 'unknown')}' 失败：{str(e)}")
        raise


def process_single_file(file_path: str, conn, cursor) -> Tuple[int, int]:
    """
    处理单个文件，返回（成功数，失败数）
    """
    # 从文件名提取类别
    category = extract_category_from_filename(file_path)
    
    # 解析JSON
    words = parse_word_json(file_path, category)
    if not words:
        return 0, 0
    
    print(f"📊  类别【{category}】共 {len(words)} 个单词待导入")
    
    success_count = 0
    fail_count = 0
    
    for idx, word in enumerate(words, 1):
        try:
            conn.begin()
            insert_word_to_mysql(conn, cursor, word)
            conn.commit()
            success_count += 1
            
            if idx % 100 == 0 or idx == len(words):
                print(f"⏳  {category} 进度：{idx}/{len(words)} ({success_count}成功/{fail_count}失败)")
                
        except Exception as e:
            conn.rollback()
            fail_count += 1
            print(f"⚠️  {category} 第{idx}个单词 '{word.get('head_word', 'unknown')}' 处理失败：{str(e)}")
            continue
    
    print(f"✅  {category} 导入完成！总计：{len(words)}，成功：{success_count}，失败：{fail_count}\n")
    return success_count, fail_count


def process_all_files():
    """处理所有JSON文件"""
    
    # 统计所有文件
    total_success = 0
    total_fail = 0
    total_files = 0
    
    # 连接数据库
    conn = None
    cursor = None
    
    try:
        conn = pymysql.connect(**MYSQL_CONFIG)
        cursor = conn.cursor()
        
        print(f"🚀  开始导入数据到MySQL，共 {len(JSON_FILE_PATHS)} 个文件\n")
        
        for file_path in JSON_FILE_PATHS:
            if not os.path.exists(file_path):
                print(f"❌  文件不存在，跳过：{file_path}")
                continue
            
            total_files += 1
            success, fail = process_single_file(file_path, conn, cursor)
            total_success += success
            total_fail += fail
        
        print("=" * 60)
        print(f"🎉  全部导入完成！")
        print(f"   处理文件数：{total_files}")
        print(f"   总成功：{total_success}")
        print(f"   总失败：{total_fail}")
        print("=" * 60)
        
    except OperationalError as e:
        error_code = e.args[0] if len(e.args) > 0 else 'Unknown'
        error_msg = e.args[1] if len(e.args) > 1 else str(e)
        print(f"❌  MySQL连接失败 - 错误码：{error_code}，错误信息：{error_msg}")
    except ProgrammingError as e:
        print(f"❌  SQL执行失败：{str(e)}，请检查表结构是否存在")
    except Exception as e:
        print(f"❌  数据入库失败：{str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("🔚  MySQL连接已关闭")


# -------------------------- 主执行入口 --------------------------
if __name__ == "__main__":
    print("=" * 60)
    print("CET 单词数据导入工具（通用表结构版）")
    print("自动从文件名提取类别")
    print("=" * 60)
    process_all_files()