-- ============================================
-- 索引优化脚本（基于实际数据分析）
-- 执行前请备份：mysqldump -u root -p word_origin > backup.sql
-- ============================================

-- ============================================
-- 1. words 主表优化（删除冗余索引）
-- ============================================

-- 1.1 删除低效的 idx_category（基数只有3，区分度太低）
-- 注意：uk_category_head_book 已经包含 category，无需单独索引
DROP INDEX idx_category ON words;

-- 1.2 可选：添加覆盖索引（高频查询场景）
-- 如果经常按类别查所有单词，添加覆盖索引避免回表
ALTER TABLE words ADD INDEX idx_category_cover (category, word_rank, head_word, us_phone, uk_phone);


-- ============================================
-- 2. word_phrases 短语表优化（前缀索引）
-- ============================================

-- 2.1 删除完整索引（p_content 可能很长）
DROP INDEX idx_p_content ON word_phrases;

-- 2.2 添加前缀索引（只索引前100字符，足够区分）
ALTER TABLE word_phrases ADD INDEX idx_p_content_prefix (p_content(100));

-- 2.3 可选：如果经常按单词查短语，已有 idx_word_main_id，无需改动


-- ============================================
-- 3. word_real_exam_sentences 真题例句表优化（联合索引）
-- ============================================

-- 3.1 添加高频查询的联合索引（按年份+题型查询是常见场景）
ALTER TABLE word_real_exam_sentences ADD INDEX idx_year_type (year, type);

-- 3.2 可选：添加 word_main_id + year 联合索引（查某单词的真题按年份排序）
ALTER TABLE word_real_exam_sentences ADD INDEX idx_word_year (word_main_id, year);


-- ============================================
-- 4. word_sentences 例句表优化（可选）
-- ============================================

-- 4.1 如果经常按单词查例句并分页，添加联合索引
ALTER TABLE word_sentences ADD INDEX idx_word_sent_desc (word_main_id, sent_desc, id);


-- ============================================
-- 5. word_trans 翻译表优化（可选）
-- ============================================

-- 5.1 如果经常按单词+词性查翻译，添加联合索引
ALTER TABLE word_trans ADD INDEX idx_word_pos (word_main_id, pos);


-- ============================================
-- 6. 删除确认无用的索引（根据实际查询情况）
-- ============================================

-- 如果确认不会单独按 year 查所有真题（通常会带 category 或其他条件），可删除
-- DROP INDEX idx_year ON word_real_exam_sentences;


-- ============================================
-- 7. 优化后分析表（更新统计信息）
-- ============================================

ANALYZE TABLE words;
ANALYZE TABLE word_phrases;
ANALYZE TABLE word_real_exam_sentences;
ANALYZE TABLE word_sentences;
ANALYZE TABLE word_trans;


-- ============================================
-- 8. 验证优化结果
-- ============================================

-- 查看优化后的索引
SELECT 
    TABLE_NAME as 表名,
    INDEX_NAME as 索引名,
    COLUMN_NAME as 列名,
    CARDINALITY as 基数,
    INDEX_TYPE as 类型
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = 'word_origin'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- 查看表大小变化
SELECT 
    TABLE_NAME as 表名,
    TABLE_ROWS as 行数,
    ROUND(DATA_LENGTH/1024/1024, 2) as 数据大小MB,
    ROUND(INDEX_LENGTH/1024/1024, 2) as 索引大小MB,
    ROUND((DATA_LENGTH+INDEX_LENGTH)/1024/1024, 2) as 总大小MB
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'word_origin'
ORDER BY (DATA_LENGTH+INDEX_LENGTH) DESC;