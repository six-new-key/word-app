package com.cetword.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "单词查询条件")
public class WordQueryDTO {

    @NotBlank(message = "类别不能为空")
    @Schema(description = "类别：cet4/cet6/初中/高中/考研/雅思/托福等", required = true, example = "cet4")
    private String category;

    @Schema(description = "关键词（支持模糊查询headWord）")
    private String keyword;

    @Schema(description = "单词书ID")
    private String bookId;

    @Schema(description = "页码，默认1")
    private Integer pageNum = 1;

    @Schema(description = "每页大小，默认20")
    private Integer pageSize = 20;
}