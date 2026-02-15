import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowLeft, Trash2, Edit2, Plus } from 'lucide-react';

const VocabularyEdit = ({ onBack, book }) => {
  const defaultBook = {
      title: "我的自定义词库",
      category: "自定义",
      level: "中等",
      count: "3",
      words: [
        { word: 'apple', mean: 'n. 苹果' },
        { word: 'banana', mean: 'n. 香蕉' },
        { word: 'cherry', mean: 'n. 樱桃' }
      ]
  };

  // Mock data based on book title to show variety
  const getMockWords = (title) => {
      if (title.includes('CET-4')) return [
          { word: 'abandon', mean: 'v. 放弃，遗弃' },
          { word: 'ability', mean: 'n. 能力，才干' },
          { word: 'abnormal', mean: 'adj. 反常的' },
          { word: 'aboard', mean: 'adv. 在船(车)上' },
          { word: 'absence', mean: 'n. 缺席，不在' }
      ];
      if (title.includes('TOEFL')) return [
          { word: 'abate', mean: 'v. 减轻，减少' },
          { word: 'aberrant', mean: 'adj. 异常的' },
          { word: 'abeyance', mean: 'n. 中止，搁置' },
          { word: 'abjure', mean: 'v. 发誓放弃' },
          { word: 'ablution', mean: 'n. 沐浴，洗礼' }
      ];
      if (title.includes('雅思')) return [
          { word: 'academic', mean: 'adj. 学术的' },
          { word: 'accelerate', mean: 'v. 加速' },
          { word: 'access', mean: 'n. 进入；途径' },
          { word: 'accommodate', mean: 'v. 容纳；适应' },
          { word: 'accumulate', mean: 'v. 积累' }
      ];
      if (title.includes('BEC')) return [
          { word: 'account', mean: 'n. 账户；解释' },
          { word: 'acquisition', mean: 'n. 收购' },
          { word: 'agenda', mean: 'n. 议程' },
          { word: 'allocate', mean: 'v. 分配' },
          { word: 'asset', mean: 'n. 资产' }
      ];
      return defaultBook.words;
  };

  const currentBook = book ? {
      ...defaultBook,
      ...book,
      words: getMockWords(book.title)
  } : defaultBook;

  return (
    <div className="flex flex-col h-full bg-background">
      <Navbar
        title="编辑词库"
        onBack={onBack}
        rightIcons={
            <button className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-lg">
                保存
            </button>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-6 space-y-4">
        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-4 space-y-3">
            <div>
                <label className="text-xs text-text-muted block mb-1">词库名称</label>
                <input type="text" defaultValue={currentBook.title} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-text-main outline-none focus:border-primary"/>
            </div>
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="text-xs text-text-muted block mb-1">分类</label>
                    <select defaultValue={currentBook.category === '推荐词库' ? '考试' : '自定义'} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-text-main outline-none focus:border-primary bg-white">
                        <option>自定义</option>
                        <option>考试</option>
                        <option>职场</option>
                        <option>生活</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-xs text-text-muted block mb-1">难度</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-text-main outline-none focus:border-primary bg-white">
                        <option>中等</option>
                        <option>简单</option>
                        <option>困难</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Word List */}
        <div className="bg-white border border-gray-200 rounded-[10px] overflow-hidden">
             <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                 <span className="text-xs font-bold text-text-main">单词列表 ({currentBook.words.length})</span>
                 <button className="text-primary text-xs">批量选择</button>
             </div>
             
             <div className="divide-y divide-gray-100">
                {currentBook.words.map((w, i) => (
                    <WordItem key={i} word={w.word} mean={w.mean} />
                ))}
             </div>
             
             <button className="w-full py-3 flex items-center justify-center gap-1 text-primary text-sm font-bold hover:bg-gray-50">
                <Plus size={16}/>
                添加单词
             </button>
        </div>
      </div>
    </div>
  );
};

const WordItem = ({ word, mean }) => (
    <div className="px-4 py-3 flex items-center justify-between group hover:bg-gray-50">
        <div>
            <div className="text-sm font-bold text-text-main">{word}</div>
            <div className="text-xs text-text-muted">{mean}</div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-text-muted hover:text-primary"><Edit2 size={14}/></button>
            <button className="p-1.5 text-text-muted hover:text-red-500"><Trash2 size={14}/></button>
        </div>
    </div>
);

export default VocabularyEdit;
