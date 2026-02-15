package com.cetword.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("words")
@Schema(description = "单词主表")
public class Word {

    @TableId(type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Integer id;

    @Schema(description = "类别：cet4/cet6/初中/高中/考研/雅思/托福等")
    private String category;

    @Schema(description = "单词序号")
    private Integer wordRank;

    @Schema(description = "英文单词")
    private String headWord;

    @Schema(description = "单词书ID")
    private String bookId;

    @Schema(description = "单词标识")
    private String wordHead;

    @Schema(description = "单词唯一ID")
    private String wordId;

    @Schema(description = "美音音标")
    private String usPhone;

    @Schema(description = "英音音标")
    private String ukPhone;

    @Schema(description = "美音发音参数")
    private String usSpeech;

    @Schema(description = "英音发音参数")
    private String ukSpeech;

    @Schema(description = "通用音标")
    private String phone;

    @Schema(description = "收藏标记")
    private Integer star;

    @Schema(description = "单词图片URL")
    private String picture;

    @Schema(description = "发音标识")
    private String speech;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}