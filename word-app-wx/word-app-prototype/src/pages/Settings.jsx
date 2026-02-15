import React from 'react';
import Navbar from '../components/Navbar';
import { ChevronRight, LogOut, Info, Moon, Volume2, Bell, Brain } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const SettingsPage = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none z-0 rounded-full blur-3xl"></div>

      <Navbar
        title="设置"
        onBack={onBack}
        rightIcons={null}
        className="!bg-transparent"
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-32 space-y-6 z-10">
        
        <SettingGroup title="学习偏好" icon={Brain}>
           <SettingRow label="字体大小" value="标准" />
           <SettingRow label="默认模式" value="看词选义" />
           <SettingRow label="每日学习量" value="50 词" />
        </SettingGroup>

        <SettingGroup title="通知与提醒" icon={Bell}>
           <SettingRow label="每日提醒" isSwitch={true} checked={true} />
           <SettingRow label="提醒时间" value="20:00" />
        </SettingGroup>

        <SettingGroup title="AI 助手" icon={Volume2}>
           <SettingRow label="启用 AI 辅助" isSwitch={true} checked={true} />
           <SettingRow label="AI 发音纠错" isSwitch={true} checked={true} />
           <SettingRow label="AI 性格" value="温柔鼓励型" />
        </SettingGroup>

        <SettingGroup title="外观" icon={Moon}>
           <SettingRow label="深色模式" value="跟随系统" />
        </SettingGroup>

        <div className="mt-4 space-y-4">
           <Motion.button 
             whileTap={{ scale: 0.98 }}
             className="w-full py-4 flex items-center justify-center gap-2 text-red-500 font-bold bg-white/80 backdrop-blur-md rounded-[24px] shadow-soft border border-white/60"
           >
              <LogOut size={18} />
              退出登录
           </Motion.button>
           
           <div className="flex flex-col items-center gap-1 text-text-muted mt-6">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2">
                 <div className="w-8 h-8 bg-primary rounded-lg"></div>
              </div>
              <span className="text-xs font-medium">Word App v1.2.0</span>
              <span className="text-[10px] opacity-60">Build 20240520</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingGroup = ({ title, icon: Icon, children }) => (
    <Motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] overflow-hidden shadow-soft"
    >
        <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-primary" />}
            <span className="text-xs font-bold text-text-sub uppercase tracking-wider">{title}</span>
        </div>
        <div className="divide-y divide-gray-100/50">
            {children}
        </div>
    </Motion.div>
);

const SettingRow = ({ label, value, isSwitch, checked }) => (
    <div className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 active:bg-gray-100 transition-colors cursor-pointer group">
        <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">{label}</span>
        {isSwitch ? (
            <div className={`w-[44px] h-[24px] rounded-full relative transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-gray-200'}`}>
                <div className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-all duration-300 ${checked ? 'left-[22px]' : 'left-[2px]'}`}></div>
            </div>
        ) : (
            <div className="flex items-center gap-2">
                <span className="text-sm text-text-sub font-medium">{value}</span>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors"/>
            </div>
        )}
    </div>
);

export default SettingsPage;
