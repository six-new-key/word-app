package com.cetword.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cetword.dto.WordQueryDTO;
import com.cetword.entity.*;
import com.cetword.entity.vo.*;
import com.cetword.mapper.WordMapper;
import com.cetword.service.WordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WordServiceImpl implements WordService {

    private final WordMapper wordMapper;

    @Override
    public ResultVO<List<WordSimpleVO>> listWords(WordQueryDTO queryDTO) {
        Page<WordSimpleVO> pageParam = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        Page<WordSimpleVO> resultPage = wordMapper.selectWordList(
                pageParam,
                queryDTO.getCategory(),
                queryDTO.getKeyword(),
                queryDTO.getBookId());

        return ResultVO.success(resultPage.getRecords(), resultPage.getTotal());
    }

    @Override
    public ResultVO<WordDetailVO> getWordDetail(Integer id) {
        // 1. 查询基础信息
        Word word = wordMapper.selectWordById(id);
        if (word == null) {
            return ResultVO.error("单词不存在");
        }

        // 2. 聚合所有关联数据
        WordDetailVO detailVO = buildWordDetailVO(word);

        return ResultVO.success(detailVO);
    }

    @Override
    public ResultVO<WordDetailVO> getWordBySpell(String headWord, String category, String bookId) {
        if (!StringUtils.hasText(category)) {
            return ResultVO.error("类别不能为空");
        }

        Word word = wordMapper.selectByHeadWord(headWord, category, bookId);
        if (word == null) {
            return ResultVO.error("单词不存在");
        }

        WordDetailVO detailVO = buildWordDetailVO(word);
        return ResultVO.success(detailVO);
    }

    @Override
    public ResultVO<WordDetailVO> getRandomWord(String category) {
        if (!StringUtils.hasText(category)) {
            return ResultVO.error("类别不能为空");
        }

        Integer randomId = wordMapper.selectRandomWordId(category);
        if (randomId == null) {
            return ResultVO.error("该类别暂无单词数据");
        }

        return getWordDetail(randomId);
    }

    /**
     * 构建单词详情VO
     */
    private WordDetailVO buildWordDetailVO(Word word) {
        Integer wordId = word.getId();

        WordDetailVO detailVO = new WordDetailVO();
        detailVO.setWord(word);
        detailVO.setTranslations(wordMapper.selectTransByWordId(wordId));
        detailVO.setSentences(wordMapper.selectSentencesByWordId(wordId));
        detailVO.setRealExamSentences(wordMapper.selectRealExamSentencesByWordId(wordId));
        detailVO.setPhrases(wordMapper.selectPhrasesByWordId(wordId));
        detailVO.setSynos(wordMapper.selectSynosByWordId(wordId));
        detailVO.setRoots(wordMapper.selectRootsByWordId(wordId));
        detailVO.setRemMethod(wordMapper.selectRemMethodByWordId(wordId));

        // 查询测试题（包含选项）
        List<WordExam> exams = wordMapper.selectExamsByWordId(wordId);
        if (exams != null && !exams.isEmpty()) {
            for (WordExam exam : exams) {
                List<WordExamChoice> choices = wordMapper.selectChoicesByExamId(exam.getId());
                exam.setChoices(choices);
            }
        }
        detailVO.setExams(exams);

        return detailVO;
    }
}