package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("word_synos")
@Schema(description = "同近义词")
public class WordSyno {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联主表ID")
    private Integer wordMainId;

    @Schema(description = "词性")
    private String pos;

    @Schema(description = "词义")
    private String synoTran;

    @Schema(description = "同近义词")
    private String synoWord;

    @Schema(description = "同近标识")
    private String synoDesc;

    private LocalDateTime createTime;
}