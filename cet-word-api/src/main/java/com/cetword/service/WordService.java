package com.cetword.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cetword.dto.WordQueryDTO;
import com.cetword.entity.vo.ResultVO;
import com.cetword.entity.vo.WordDetailVO;
import com.cetword.entity.vo.WordSimpleVO;

import java.util.List;

public interface WordService {

    /**
     * 分页查询单词列表（指定类别）
     */
    ResultVO<List<WordSimpleVO>> listWords(WordQueryDTO queryDTO);

    /**
     * 获取单词详情
     */
    ResultVO<WordDetailVO> getWordDetail(Integer id);

    /**
     * 根据单词拼写和类别查询
     */
    ResultVO<WordDetailVO> getWordBySpell(String headWord, String category, String bookId);

    /**
     * 随机获取一个单词（指定类别）
     */
    ResultVO<WordDetailVO> getRandomWord(String category);
}