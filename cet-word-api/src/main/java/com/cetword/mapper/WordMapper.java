package com.cetword.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cetword.entity.*;
import com.cetword.entity.vo.WordSimpleVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface WordMapper extends BaseMapper<Word> {

    /**
     * 分页查询单词列表（带简要释义）
     */
    Page<WordSimpleVO> selectWordList(@Param("page") Page<WordSimpleVO> page,
                                      @Param("category") String category,
                                      @Param("keyword") String keyword,
                                      @Param("bookId") String bookId);

    /**
     * 查询单词详情
     */
    Word selectWordById(@Param("id") Integer id);

    /**
     * 根据headWord和category查询
     */
    Word selectByHeadWord(@Param("headWord") String headWord,
                          @Param("category") String category,
                          @Param("bookId") String bookId);

    /**
     * 随机获取一个单词ID（指定类别）
     */
    Integer selectRandomWordId(@Param("category") String category);

    // ==================== 子表查询（通过word_main_id关联，无需category）====================

    List<WordTrans> selectTransByWordId(@Param("wordId") Integer wordId);

    List<WordSentence> selectSentencesByWordId(@Param("wordId") Integer wordId);

    List<WordRealExamSentence> selectRealExamSentencesByWordId(@Param("wordId") Integer wordId);

    List<WordPhrase> selectPhrasesByWordId(@Param("wordId") Integer wordId);

    List<WordSyno> selectSynosByWordId(@Param("wordId") Integer wordId);

    List<WordRoot> selectRootsByWordId(@Param("wordId") Integer wordId);

    WordRemMethod selectRemMethodByWordId(@Param("wordId") Integer wordId);

    List<WordExam> selectExamsByWordId(@Param("wordId") Integer wordId);

    List<WordExamChoice> selectChoicesByExamId(@Param("examId") Integer examId);
}