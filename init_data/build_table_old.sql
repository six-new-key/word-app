-- ============================================
-- 1、CET4单词主表
-- ============================================
CREATE TABLE `cet4_words` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增主键，所有子表关联此字段',
  `word_rank` int DEFAULT NULL COMMENT '单词在单词书中的序号，对应JSON[wordRank]',
  `head_word` varchar(100) NOT NULL COMMENT '英文单词，对应JSON[headWord]（已处理法语字符）',
  `book_id` varchar(50) DEFAULT NULL COMMENT '单词书ID，对应JSON[bookId]，如CET4_3',
  `word_head` varchar(100) DEFAULT NULL COMMENT '单词标识，对应JSON[content][word][wordHead]',
  `word_id` varchar(50) DEFAULT NULL COMMENT '单词唯一ID，对应JSON[content][word][wordId]，如CET4_3_1',
  `us_phone` varchar(200) DEFAULT NULL COMMENT '美音音标，对应JSON[content][word][content][usphone]',
  `uk_phone` varchar(200) DEFAULT NULL COMMENT '英音音标，对应JSON[content][word][content][ukphone]',
  `us_speech` varchar(200) DEFAULT NULL COMMENT '美音发音请求参数，对应JSON[content][word][content][usspeech]',
  `uk_speech` varchar(200) DEFAULT NULL COMMENT '英音发音请求参数，对应JSON[content][word][content][ukspeech]',
  `phone` varchar(200) DEFAULT NULL COMMENT '通用音标，对应JSON[content][word][content][phone]',
  `star` tinyint DEFAULT '0' COMMENT '收藏标记，对应JSON[content][word][content][star]',
  `picture` varchar(500) DEFAULT NULL COMMENT '单词图片URL，对应JSON[content][word][content][picture]',
  `speech` varchar(100) DEFAULT NULL COMMENT '发音标识，对应JSON[content][word][content][speech]',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_head_book` (`head_word`,`book_id`) COMMENT '唯一索引：同一单词书内单词不重复',
  KEY `idx_book_id` (`book_id`) COMMENT '普通索引：按单词书ID查单词',
  KEY `idx_head_word` (`head_word`) COMMENT '普通索引：按单词名快速查询（高频）'
) ENGINE=InnoDB AUTO_INCREMENT=1163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词主表-存储一对一基础/发音信息';

-- ============================================
-- 2、CET4单词翻译表
-- ============================================
CREATE TABLE `cet4_word_trans` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `word_main_id` INT NOT NULL COMMENT '关联主表cet4_words.id',
  `pos` VARCHAR(20) DEFAULT NULL COMMENT '词性，对应JSON[content][word][content][trans][*][pos]，如vt/vi/n',
  `tran_cn` TEXT DEFAULT NULL COMMENT '中文释义，对应JSON[content][word][content][trans][*][tranCn]',
  `tran_other` TEXT DEFAULT NULL COMMENT '英英释义，对应JSON[content][word][content][trans][*][tranOther]',
  `desc_cn` VARCHAR(50) DEFAULT NULL COMMENT '中释标识，对应JSON[content][word][content][trans][*][descCn]',
  `desc_other` VARCHAR(50) DEFAULT NULL COMMENT '英释标识，对应JSON[content][word][content][trans][*][descOther]',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`) COMMENT '关联索引：主表关联必备',
  KEY `idx_pos` (`pos`) COMMENT '普通索引：按词性查单词释义（高频）',
  CONSTRAINT `fk_cet4_trans_word` FOREIGN KEY (`word_main_id`) REFERENCES `cet4_words` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词翻译表-按词性存储中释/英释';

-- ============================================
-- 3、CET4单词例句表
-- ============================================
CREATE TABLE `cet4_word_sentences` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `word_main_id` INT NOT NULL COMMENT '关联主表cet4_words.id',
  `s_content` VARCHAR(800) DEFAULT NULL COMMENT '英文例句，对应JSON[content][word][content][sentence][sentences][*][sContent]',
  `s_cn` VARCHAR(1000) DEFAULT NULL COMMENT '例句中文翻译，对应JSON[content][word][content][sentence][sentences][*][sCn]',
  `sent_desc` VARCHAR(50) DEFAULT NULL COMMENT '例句标识，对应JSON[content][word][content][sentence][desc]，固定为“例句”',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`) COMMENT '关联索引：主表关联必备',
  FULLTEXT KEY `ft_idx_s_content` (`s_content`) COMMENT '全文索引：模糊查询英文例句（高频）',
  FULLTEXT KEY `ft_idx_s_cn` (`s_cn`) COMMENT '全文索引：模糊查询中文例句（高频）',
  CONSTRAINT `fk_cet4_sent_word` FOREIGN KEY (`word_main_id`) REFERENCES `cet4_words` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词例句表-存储所有例句，支持模糊查询';

-- ============================================
-- 4、CET4单词短语表
-- ============================================
CREATE TABLE `cet4_word_phrases` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `word_main_id` INT NOT NULL COMMENT '关联主表cet4_words.id',
  `p_content` VARCHAR(500) DEFAULT NULL COMMENT '英文短语，对应JSON[content][word][content][phrase][phrases][*][pContent]',
  `p_cn` VARCHAR(800) DEFAULT NULL COMMENT '短语中文翻译，对应JSON[content][word][content][phrase][phrases][*][pCn]',
  `phrase_desc` VARCHAR(50) DEFAULT NULL COMMENT '短语标识，对应JSON[content][word][content][phrase][desc]，固定为“短语”',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`) COMMENT '关联索引：主表关联必备',
  KEY `idx_p_content` (`p_content`) COMMENT '普通索引：按英文短语查对应单词（高频）',
  CONSTRAINT `fk_cet4_phrase_word` FOREIGN KEY (`word_main_id`) REFERENCES `cet4_words` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词短语表-存储所有短语，支持按短语查单词';

-- ============================================
-- 5、CET4单词同近义词表
-- ============================================
CREATE TABLE `cet4_word_synos` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `word_main_id` INT NOT NULL COMMENT '关联主表cet4_words.id',
  `pos` VARCHAR(20) DEFAULT NULL COMMENT '词性，对应JSON[content][word][content][syno][synos][*][pos]',
  `syno_tran` VARCHAR(500) DEFAULT NULL COMMENT '该词性下的词义，对应JSON[content][word][content][syno][synos][*][tran]',
  `syno_word` VARCHAR(200) DEFAULT NULL COMMENT '同近义词/词组，对应JSON[content][word][content][syno][synos][*][hwds][*][w]',
  `syno_desc` VARCHAR(50) DEFAULT NULL COMMENT '同近标识，对应JSON[content][word][content][syno][desc]，固定为“同近”',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`) COMMENT '关联索引：主表关联必备',
  KEY `idx_pos` (`pos`) COMMENT '普通索引：按词性查近义词',
  KEY `idx_syno_word` (`syno_word`) COMMENT '普通索引：按近义词查对应单词（高频）',
  CONSTRAINT `fk_cet4_syno_word` FOREIGN KEY (`word_main_id`) REFERENCES `cet4_words` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词同近义词表-按词性+单个近义词存储，支持反向查询';

-- ============================================
-- 6、CET4单词同根词表
-- ============================================
CREATE TABLE `cet4_word_roots` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `word_main_id` INT NOT NULL COMMENT '关联主表cet4_words.id',
  `pos` VARCHAR(20) DEFAULT NULL COMMENT '词性，对应JSON[content][word][content][relWord][rels][*][pos]',
  `root_word` VARCHAR(200) DEFAULT NULL COMMENT '同根词，对应JSON[content][word][content][relWord][rels][*][words][*][hwd]',
  `root_tran` VARCHAR(500) DEFAULT NULL COMMENT '同根词释义，对应JSON[content][word][content][relWord][rels][*][words][*][tran]',
  `root_desc` VARCHAR(50) DEFAULT NULL COMMENT '同根标识，对应JSON[content][word][content][relWord][desc]，固定为“同根”',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`) COMMENT '关联索引：主表关联必备',
  KEY `idx_root_word` (`root_word`) COMMENT '普通索引：按同根词查对应单词（高频）',
  CONSTRAINT `fk_cet4_root_word` FOREIGN KEY (`word_main_id`) REFERENCES `cet4_words` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词同根词表-按词性+单个同根词存储，支持反向查询';

-- ============================================
-- 7、CET4单词测试题主表
-- ============================================
CREATE TABLE `cet4_word_exams` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键，选项表关联此字段',
  `word_main_id` INT NOT NULL COMMENT '关联主表cet4_words.id',
  `question` TEXT DEFAULT NULL COMMENT '测试题问题，对应JSON[content][word][content][exam][*][question]',
  `exam_type` TINYINT DEFAULT NULL COMMENT '测试题型，对应JSON[content][word][content][exam][*][examType]，如1',
  `right_index` TINYINT DEFAULT NULL COMMENT '正确选项索引，对应JSON[content][word][content][exam][*][answer][rightIndex]，如4',
  `answer_explain` TEXT DEFAULT NULL COMMENT '答案解析，对应JSON[content][word][content][exam][*][answer][explain]',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`) COMMENT '关联索引：主表关联必备',
  CONSTRAINT `fk_cet4_exam_word` FOREIGN KEY (`word_main_id`) REFERENCES `cet4_words` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词测试题主表-存储测试题核心信息';

-- ============================================
-- 8、CET4测试题选项表
-- ============================================
CREATE TABLE `cet4_word_exam_choices` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `exam_main_id` INT NOT NULL COMMENT '关联测试题主表cet4_word_exams.id',
  `choice_index` TINYINT DEFAULT NULL COMMENT '选项索引，对应JSON[content][word][content][exam][*][choices][*][choiceIndex]，如1/2/3/4',
  `choice_content` VARCHAR(200) DEFAULT NULL COMMENT '选项内容，对应JSON[content][word][content][exam][*][choices][*][choice]',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  KEY `idx_exam_main_id` (`exam_main_id`) COMMENT '关联索引：测试题主表关联必备',
  CONSTRAINT `fk_cet4_choice_exam` FOREIGN KEY (`exam_main_id`) REFERENCES `cet4_word_exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4测试题选项表-存储单个测试题的所有选项';

-- ============================================
-- 9、CET4单词真题例句表
-- ============================================
CREATE TABLE IF NOT EXISTS `cet4_word_real_exam_sentences` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `word_main_id` INT NOT NULL COMMENT '关联主表cet4_words.id',
  `s_content` VARCHAR(1000) DEFAULT NULL COMMENT '真题例句英文内容',
  `paper` VARCHAR(50) DEFAULT NULL COMMENT '试卷套数，如"第一套"',
  `level` VARCHAR(20) DEFAULT NULL COMMENT '考试等级，如"CET4"',
  `year` VARCHAR(20) DEFAULT NULL COMMENT '考试年份，如"2017.6"',
  `type` VARCHAR(50) DEFAULT NULL COMMENT '题目类型，如"阅读理解"',
  `real_exam_desc` VARCHAR(50) DEFAULT NULL COMMENT '真题标识，固定为"真题例句"',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`) COMMENT '关联索引：主表关联必备',
  KEY `idx_year` (`year`) COMMENT '普通索引：按年份查询真题',
  KEY `idx_type` (`type`) COMMENT '普通索引：按题型查询',
  FULLTEXT KEY `ft_idx_s_content` (`s_content`) COMMENT '全文索引：模糊查询真题例句',
  CONSTRAINT `fk_cet4_real_exam_word` FOREIGN KEY (`word_main_id`) REFERENCES `cet4_words` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词真题例句表-存储历年真题中出现的例句';

-- ============================================
-- 10、CET4单词记忆方法表
-- ============================================
CREATE TABLE IF NOT EXISTS `cet4_word_rem_methods` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `word_main_id` INT NOT NULL COMMENT '关联主表cet4_words.id',
  `val` VARCHAR(500) DEFAULT NULL COMMENT '记忆方法内容',
  `desc` VARCHAR(50) DEFAULT NULL COMMENT '记忆方法标识，如"记忆"',
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_word_main_id` (`word_main_id`) COMMENT '唯一索引：一个单词只有一个记忆方法',
  CONSTRAINT `fk_cet4_rem_word` FOREIGN KEY (`word_main_id`) REFERENCES `cet4_words` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CET4单词记忆方法表-存储词根词缀等记忆技巧';


