package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("word_rem_methods")
@Schema(description = "记忆方法")
public class WordRemMethod {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联主表ID")
    private Integer wordMainId;

    @Schema(description = "记忆方法内容")
    private String val;

    @Schema(description = "记忆方法标识")
    private String desc;

    private LocalDateTime createTime;
}