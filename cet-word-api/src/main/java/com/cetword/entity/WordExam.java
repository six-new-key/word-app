package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("word_exams")
@Schema(description = "测试题")
public class WordExam {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联主表ID")
    private Integer wordMainId;

    @Schema(description = "题目")
    private String question;

    @Schema(description = "题型")
    private Integer examType;

    @Schema(description = "正确选项索引")
    private Integer rightIndex;

    @Schema(description = "答案解析")
    private String answerExplain;

    private LocalDateTime createTime;

    // 非数据库字段
    @Schema(description = "选项列表")
    private List<WordExamChoice> choices;
}