import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowLeft, Camera, FileText, Link as LinkIcon, HelpCircle } from 'lucide-react';

const VocabularyImport = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-background">
      <Navbar
        title="导入词库"
        onBack={onBack}
        rightIcons={null}
      />

      <div className="flex-1 flex flex-col justify-center px-6 gap-6 pb-20">
        <ImportOption 
            icon={Camera} 
            title="拍照导入" 
            desc="拍摄课本/笔记，AI自动识别去重" 
        />
        <ImportOption 
            icon={FileText} 
            title="文本导入" 
            desc="支持TXT/Excel格式，批量导入" 
        />
        <ImportOption 
            icon={LinkIcon} 
            title="链接导入" 
            desc="粘贴词库链接，自动解析同步" 
        />
        
        <div className="text-center mt-8">
            <button className="text-primary text-sm flex items-center justify-center gap-1 mx-auto hover:underline">
                <HelpCircle size={16}/>
                词库导入帮助
            </button>
        </div>
      </div>
    </div>
  );
};

const ImportOption = ({ icon, title, desc }) => (
    <div className="bg-white border border-gray-200 rounded-[10px] p-6 flex flex-col items-center gap-3 hover:bg-primary/5 hover:border-primary/30 hover:scale-105 transition-all cursor-pointer group shadow-sm">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            {React.createElement(icon, { size: 24 })}
        </div>
        <div className="text-center">
            <div className="font-bold text-text-main text-lg mb-1">{title}</div>
            <div className="text-xs text-text-muted">{desc}</div>
        </div>
    </div>
);

export default VocabularyImport;
