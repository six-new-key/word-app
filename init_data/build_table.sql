-- ============================================
-- 方案A：仅主表加category（推荐）
-- ============================================

-- 1. 单词主表（唯一需要category字段）
CREATE TABLE `words` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(50) NOT NULL COMMENT '类别：cet4/cet6/初中/高中/考研/雅思/托福/专四/专八',
  `word_rank` INT DEFAULT NULL,
  `head_word` VARCHAR(100) NOT NULL,
  `book_id` VARCHAR(50) DEFAULT NULL,
  `word_head` VARCHAR(100) DEFAULT NULL,
  `word_id` VARCHAR(50) DEFAULT NULL,
  `us_phone` VARCHAR(200) DEFAULT NULL,
  `uk_phone` VARCHAR(200) DEFAULT NULL,
  `us_speech` VARCHAR(200) DEFAULT NULL,
  `uk_speech` VARCHAR(200) DEFAULT NULL,
  `phone` VARCHAR(200) DEFAULT NULL,
  `star` TINYINT DEFAULT 0,
  `picture` VARCHAR(500) DEFAULT NULL,
  `speech` VARCHAR(100) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_category_head_book` (`category`, `head_word`, `book_id`),
  KEY `idx_category` (`category`),
  KEY `idx_head_word` (`head_word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 翻译表（无category，通过word_main_id关联）
CREATE TABLE `word_trans` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_main_id` INT NOT NULL,
  `pos` VARCHAR(20) DEFAULT NULL,
  `tran_cn` TEXT DEFAULT NULL,
  `tran_other` TEXT DEFAULT NULL,
  `desc_cn` VARCHAR(50) DEFAULT NULL,
  `desc_other` VARCHAR(50) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`),
  KEY `idx_pos` (`pos`),
  CONSTRAINT `fk_trans_word` FOREIGN KEY (`word_main_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 例句表（无category）
CREATE TABLE `word_sentences` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_main_id` INT NOT NULL,
  `s_content` VARCHAR(800) DEFAULT NULL,
  `s_cn` VARCHAR(1000) DEFAULT NULL,
  `sent_desc` VARCHAR(50) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`),
  FULLTEXT KEY `ft_s_content` (`s_content`),
  FULLTEXT KEY `ft_s_cn` (`s_cn`),
  CONSTRAINT `fk_sent_word` FOREIGN KEY (`word_main_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 真题例句表（无category）
CREATE TABLE `word_real_exam_sentences` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_main_id` INT NOT NULL,
  `s_content` VARCHAR(1000) DEFAULT NULL,
  `paper` VARCHAR(50) DEFAULT NULL,
  `level` VARCHAR(20) DEFAULT NULL,
  `year` VARCHAR(20) DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT NULL,
  `real_exam_desc` VARCHAR(50) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`),
  KEY `idx_year` (`year`),
  CONSTRAINT `fk_real_exam_word` FOREIGN KEY (`word_main_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 短语表（无category）
CREATE TABLE `word_phrases` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_main_id` INT NOT NULL,
  `p_content` VARCHAR(500) DEFAULT NULL,
  `p_cn` VARCHAR(800) DEFAULT NULL,
  `phrase_desc` VARCHAR(50) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`),
  KEY `idx_p_content` (`p_content`),
  CONSTRAINT `fk_phrase_word` FOREIGN KEY (`word_main_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 同近义词表（无category）
CREATE TABLE `word_synos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_main_id` INT NOT NULL,
  `pos` VARCHAR(20) DEFAULT NULL,
  `syno_tran` VARCHAR(500) DEFAULT NULL,
  `syno_word` VARCHAR(200) DEFAULT NULL,
  `syno_desc` VARCHAR(50) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`),
  KEY `idx_syno_word` (`syno_word`),
  CONSTRAINT `fk_syno_word` FOREIGN KEY (`word_main_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. 同根词表（无category）
CREATE TABLE `word_roots` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_main_id` INT NOT NULL,
  `pos` VARCHAR(20) DEFAULT NULL,
  `root_word` VARCHAR(200) DEFAULT NULL,
  `root_tran` VARCHAR(500) DEFAULT NULL,
  `root_desc` VARCHAR(50) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`),
  KEY `idx_root_word` (`root_word`),
  CONSTRAINT `fk_root_word` FOREIGN KEY (`word_main_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. 记忆方法表（无category）
CREATE TABLE `word_rem_methods` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_main_id` INT NOT NULL,
  `val` VARCHAR(500) DEFAULT NULL,
  `desc` VARCHAR(50) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_word_main_id` (`word_main_id`),
  CONSTRAINT `fk_rem_word` FOREIGN KEY (`word_main_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. 测试题表（无category）
CREATE TABLE `word_exams` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_main_id` INT NOT NULL,
  `question` TEXT DEFAULT NULL,
  `exam_type` TINYINT DEFAULT NULL,
  `right_index` TINYINT DEFAULT NULL,
  `answer_explain` TEXT DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_word_main_id` (`word_main_id`),
  CONSTRAINT `fk_exam_word` FOREIGN KEY (`word_main_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. 测试选项表（无category）
CREATE TABLE `word_exam_choices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `exam_main_id` INT NOT NULL,
  `choice_index` TINYINT DEFAULT NULL,
  `choice_content` VARCHAR(200) DEFAULT NULL,
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_exam_main_id` (`exam_main_id`),
  CONSTRAINT `fk_choice_exam` FOREIGN KEY (`exam_main_id`) REFERENCES `word_exams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;