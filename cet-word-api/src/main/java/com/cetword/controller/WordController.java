package com.cetword.controller;

import com.cetword.dto.WordQueryDTO;
import com.cetword.entity.vo.ResultVO;
import com.cetword.entity.vo.WordDetailVO;
import com.cetword.entity.vo.WordSimpleVO;
import com.cetword.service.WordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "单词查询", description = "CET4/CET6/考研等单词查询相关接口")
@RestController
@RequestMapping("/word")
@RequiredArgsConstructor
@Validated
public class WordController {

    private final WordService wordService;

    @Operation(summary = "分页查询单词列表", description = "按类别查询，支持关键词模糊搜索")
    @PostMapping("/list")
    public ResultVO<List<WordSimpleVO>> listWords(
            @Parameter(description = "查询条件", required = true)
            @RequestBody @Validated WordQueryDTO queryDTO) {
        return wordService.listWords(queryDTO);
    }

    @Operation(summary = "获取单词详情", description = "根据ID获取单词完整信息")
    @GetMapping("/detail/{id}")
    public ResultVO<WordDetailVO> getWordDetail(
            @Parameter(description = "单词ID", required = true)
            @PathVariable Integer id) {
        return wordService.getWordDetail(id);
    }

    @Operation(summary = "根据拼写查询单词", description = "根据单词拼写和类别获取详情")
    @GetMapping("/spell/{headWord}")
    public ResultVO<WordDetailVO> getWordBySpell(
            @Parameter(description = "单词拼写", required = true, example = "access")
            @PathVariable String headWord,
            @Parameter(description = "类别", required = true, example = "cet4")
            @RequestParam String category,
            @Parameter(description = "单词书ID（可选）")
            @RequestParam(required = false) String bookId) {
        return wordService.getWordBySpell(headWord, category, bookId);
    }

    @Operation(summary = "随机获取单词", description = "从指定类别随机获取一个单词")
    @GetMapping("/random")
    public ResultVO<WordDetailVO> getRandomWord(
            @Parameter(description = "类别", required = true, example = "cet4")
            @RequestParam String category) {
        return wordService.getRandomWord(category);
    }
}