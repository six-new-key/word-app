-- 1. 查看主表统计（含新增字段）
SELECT 
    COUNT(*) as total_words,
    SUM(CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 ELSE 0 END) as has_phone,
    SUM(CASE WHEN picture IS NOT NULL AND picture != '' THEN 1 ELSE 0 END) as has_picture,
    SUM(CASE WHEN speech IS NOT NULL AND speech != '' THEN 1 ELSE 0 END) as has_speech,
    SUM(star) as total_stars
FROM words;

-- 3. 各子表数据统计（含新增表）
SELECT '翻译' as 数据类型, COUNT(*) as 数量 FROM word_trans
UNION ALL SELECT '普通例句', COUNT(*) FROM word_sentences
UNION ALL SELECT '【新增】真题例句', COUNT(*) FROM word_real_exam_sentences
UNION ALL SELECT '短语', COUNT(*) FROM word_phrases
UNION ALL SELECT '同近义词', COUNT(*) FROM word_synos
UNION ALL SELECT '同根词', COUNT(*) FROM word_roots
UNION ALL SELECT '【新增】记忆方法', COUNT(*) FROM word_rem_methods
UNION ALL SELECT '测试题', COUNT(*) FROM word_exams
UNION ALL SELECT '测试选项', COUNT(*) FROM word_exam_choices
ORDER BY 数量 DESC;