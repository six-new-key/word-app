package com.cetword.entity.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "统一响应结果")
public class ResultVO<T> {

    @Schema(description = "状态码：0成功，其他失败")
    private Integer code;

    @Schema(description = "提示信息")
    private String message;

    @Schema(description = "数据")
    private T data;

    @Schema(description = "总数（分页用）")
    private Long total;

    public static <T> ResultVO<T> success(T data) {
        ResultVO<T> result = new ResultVO<>();
        result.setCode(0);
        result.setMessage("success");
        result.setData(data);
        return result;
    }

    public static <T> ResultVO<T> success(T data, Long total) {
        ResultVO<T> result = success(data);
        result.setTotal(total);
        return result;
    }

    public static <T> ResultVO<T> error(String message) {
        ResultVO<T> result = new ResultVO<>();
        result.setCode(1);
        result.setMessage(message);
        return result;
    }

    public static <T> ResultVO<T> error(Integer code, String message) {
        ResultVO<T> result = new ResultVO<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }
}