package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("word_sentences")
@Schema(description = "单词例句")
public class WordSentence {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联主表ID")
    private Integer wordMainId;

    @Schema(description = "英文例句")
    private String sContent;

    @Schema(description = "中文翻译")
    private String sCn;

    @Schema(description = "例句标识")
    private String sentDesc;

    private LocalDateTime createTime;
}