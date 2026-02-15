package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("word_real_exam_sentences")
@Schema(description = "真题例句")
public class WordRealExamSentence {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联主表ID")
    private Integer wordMainId;

    @Schema(description = "真题例句英文内容")
    private String sContent;

    @Schema(description = "试卷套数")
    private String paper;

    @Schema(description = "考试等级")
    private String level;

    @Schema(description = "考试年份")
    private String year;

    @Schema(description = "题目类型")
    private String type;

    @Schema(description = "真题标识")
    private String realExamDesc;

    private LocalDateTime createTime;
}