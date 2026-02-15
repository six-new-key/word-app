package com.cetword.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "单词简要信息")
public class WordSimpleVO {

    @Schema(description = "类别")
    private String category;

    @Schema(description = "单词ID")
    private Integer id;

    @Schema(description = "单词序号")
    private Integer wordRank;

    @Schema(description = "英文单词")
    private String headWord;

    @Schema(description = "美音音标")
    private String usPhone;

    @Schema(description = "英音音标")
    private String ukPhone;

    @Schema(description = "中文释义（简要）")
    private String briefTrans;
}