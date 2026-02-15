package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("word_phrases")
@Schema(description = "单词短语")
public class WordPhrase {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联主表ID")
    private Integer wordMainId;

    @Schema(description = "英文短语")
    private String pContent;

    @Schema(description = "中文翻译")
    private String pCn;

    @Schema(description = "短语标识")
    private String phraseDesc;

    private LocalDateTime createTime;
}