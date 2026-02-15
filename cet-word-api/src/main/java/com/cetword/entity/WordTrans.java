package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("word_trans")
@Schema(description = "单词翻译")
public class WordTrans {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @Schema(description = "关联主表ID")
    private Integer wordMainId;

    @Schema(description = "词性")
    private String pos;

    @Schema(description = "中文释义")
    private String tranCn;

    @Schema(description = "英英释义")
    private String tranOther;

    @Schema(description = "中释标识")
    private String descCn;

    @Schema(description = "英释标识")
    private String descOther;

    private LocalDateTime createTime;
}