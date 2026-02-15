// 设置页交互逻辑

// 设置数据
let settings = {
    dailyGoal: 20,
    studyMode: '标准模式',
    autoPlay: true,
    studyReminder: true,
    reminderTime: '09:00',
    reviewReminder: true,
    nightMode: false,
    fontSize: '中',
    aiAssistant: true,
    aiPronunciation: true,
    smartRecommend: true
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initSettingListeners();
});

// 加载设置
function loadSettings() {
    // 从localStorage加载设置
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }
    
    // 应用设置到UI
    applySettingsToUI();
}

// 应用设置到UI
function applySettingsToUI() {
    // 每日目标
    const goalSelect = document.querySelector('.settings-list select');
    if (goalSelect) {
        goalSelect.value = settings.dailyGoal + '词';
    }
    
    // 学习模式
    const modeSelects = document.querySelectorAll('.settings-list select');
    if (modeSelects[1]) {
        modeSelects[1].value = settings.studyMode;
    }
    
    // 开关状态
    const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    switches[0].checked = settings.autoPlay;
    switches[1].checked = settings.studyReminder;
    switches[2].checked = settings.reviewReminder;
    switches[3].checked = settings.nightMode;
    switches[4].checked = settings.aiAssistant;
    switches[5].checked = settings.aiPronunciation;
    switches[6].checked = settings.smartRecommend;
    
    // 提醒时间
    const timeInput = document.querySelector('input[type="time"]');
    if (timeInput) {
        timeInput.value = settings.reminderTime;
    }
    
    // 字体大小
    const fontSelect = document.querySelectorAll('.settings-list select')[2];
    if (fontSelect) {
        fontSelect.value = settings.fontSize;
    }
    
    // 应用夜间模式
    if (settings.nightMode) {
        document.body.classList.add('night-mode');
    }
}

// 初始化设置监听器
function initSettingListeners() {
    // 每日目标
    const goalSelect = document.querySelector('.settings-list select');
    if (goalSelect) {
        goalSelect.addEventListener('change', (e) => {
            settings.dailyGoal = parseInt(e.target.value);
            saveSettings();
            showToast('每日目标已更新');
        });
    }
    
    // 学习模式
    const modeSelects = document.querySelectorAll('.settings-list select');
    if (modeSelects[1]) {
        modeSelects[1].addEventListener('change', (e) => {
            settings.studyMode = e.target.value;
            saveSettings();
            showToast('学习模式已更新');
        });
    }
    
    // 字体大小
    if (modeSelects[2]) {
        modeSelects[2].addEventListener('change', (e) => {
            settings.fontSize = e.target.value;
            saveSettings();
            applyFontSize(e.target.value);
            showToast('字体大小已更新');
        });
    }
    
    // 所有开关
    const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    switches.forEach((sw, index) => {
        sw.addEventListener('change', (e) => {
            const settingNames = [
                'autoPlay', 'studyReminder', 'reviewReminder', 
                'nightMode', 'aiAssistant', 'aiPronunciation', 'smartRecommend'
            ];
            settings[settingNames[index]] = e.target.checked;
            saveSettings();
            
            // 特殊处理夜间模式
            if (settingNames[index] === 'nightMode') {
                toggleNightMode();
            }
        });
    });
    
    // 提醒时间
    const timeInput = document.querySelector('input[type="time"]');
    if (timeInput) {
        timeInput.addEventListener('change', (e) => {
            settings.reminderTime = e.target.value;
            saveSettings();
            showToast('提醒时间已更新');
        });
    }
}

// 保存设置
function saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(settings));
}

// 应用字体大小
function applyFontSize(size) {
    const root = document.documentElement;
    switch(size) {
        case '小':
            root.style.fontSize = '14px';
            break;
        case '中':
            root.style.fontSize = '16px';
            break;
        case '大':
            root.style.fontSize = '18px';
            break;
    }
}

// 显示提示
function showToast(message) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    document.body.appendChild(toast);
    
    // 2秒后移除
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 清理缓存
function clearCache() {
    if (confirm('确定要清理缓存吗？这将删除所有离线数据。')) {
        // 清理localStorage（除了设置）
        const settingsBackup = localStorage.getItem('appSettings');
        localStorage.clear();
        if (settingsBackup) {
            localStorage.setItem('appSettings', settingsBackup);
        }
        
        showToast('缓存已清理');
    }
}

// 检查更新
function checkUpdate() {
    showToast('正在检查更新...');
    
    // 模拟检查更新
    setTimeout(() => {
        showToast('已是最新版本 v1.0.0');
    }, 1500);
}
