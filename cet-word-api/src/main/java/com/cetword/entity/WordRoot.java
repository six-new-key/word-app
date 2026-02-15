package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("word_roots")
@Schema(description = "同根词")
public class WordRoot {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联主表ID")
    private Integer wordMainId;

    @Schema(description = "词性")
    private String pos;

    @Schema(description = "同根词")
    private String rootWord;

    @Schema(description = "同根词释义")
    private String rootTran;

    @Schema(description = "同根标识")
    private String rootDesc;

    private LocalDateTime createTime;
}