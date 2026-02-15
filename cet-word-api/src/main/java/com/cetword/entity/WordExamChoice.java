package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("word_exam_choices")
@Schema(description = "测试题选项")
public class WordExamChoice {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联测试题ID")
    private Integer examMainId;

    @Schema(description = "选项索引")
    private Integer choiceIndex;

    @Schema(description = "选项内容")
    private String choiceContent;

    private LocalDateTime createTime;
}