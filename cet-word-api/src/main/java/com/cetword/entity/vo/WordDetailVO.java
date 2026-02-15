package com.cetword.entity.vo;

import com.cetword.entity.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "单词完整详情")
public class WordDetailVO {

    @Schema(description = "基础信息")
    private Word word;

    @Schema(description = "翻译列表")
    private List<WordTrans> translations;

    @Schema(description = "普通例句列表")
    private List<WordSentence> sentences;

    @Schema(description = "真题例句列表")
    private List<WordRealExamSentence> realExamSentences;

    @Schema(description = "短语列表")
    private List<WordPhrase> phrases;

    @Schema(description = "同近义词列表")
    private List<WordSyno> synos;

    @Schema(description = "同根词列表")
    private List<WordRoot> roots;

    @Schema(description = "记忆方法")
    private WordRemMethod remMethod;

    @Schema(description = "测试题列表")
    private List<WordExam> exams;
}