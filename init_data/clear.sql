-- ============================================
-- 清空所有表数据（保留表结构）
-- 注意：执行前请确认数据已备份！
-- ============================================

-- 关闭外键检查，避免删除顺序限制
SET FOREIGN_KEY_CHECKS = 0;

-- 按依赖关系清空子表（先清空有外键关联的表）
TRUNCATE TABLE `cet4_word_exam_choices`;
TRUNCATE TABLE `cet4_word_exams`;
TRUNCATE TABLE `cet4_word_real_exam_sentences`;  -- 新增：真题例句
TRUNCATE TABLE `cet4_word_rem_methods`;          -- 新增：记忆方法
TRUNCATE TABLE `cet4_word_roots`;
TRUNCATE TABLE `cet4_word_synos`;
TRUNCATE TABLE `cet4_word_phrases`;
TRUNCATE TABLE `cet4_word_sentences`;
TRUNCATE TABLE `cet4_word_trans`;

-- 最后清空主表
TRUNCATE TABLE `cet4_words`;

-- 重新开启外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 验证清空结果
SELECT 'cet4_words' as table_name, COUNT(*) as cnt FROM cet4_words
UNION ALL
SELECT 'cet4_word_trans', COUNT(*) FROM cet4_word_trans
UNION ALL
SELECT 'cet4_word_sentences', COUNT(*) FROM cet4_word_sentences
UNION ALL
SELECT 'cet4_word_phrases', COUNT(*) FROM cet4_word_phrases
UNION ALL
SELECT 'cet4_word_synos', COUNT(*) FROM cet4_word_synos
UNION ALL
SELECT 'cet4_word_roots', COUNT(*) FROM cet4_word_roots
UNION ALL
SELECT 'cet4_word_exams', COUNT(*) FROM cet4_word_exams
UNION ALL
SELECT 'cet4_word_exam_choices', COUNT(*) FROM cet4_word_exam_choices
UNION ALL
SELECT 'cet4_word_real_exam_sentences', COUNT(*) FROM cet4_word_real_exam_sentences
UNION ALL
SELECT 'cet4_word_rem_methods', COUNT(*) FROM cet4_word_rem_methods;