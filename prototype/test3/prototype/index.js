// 首页交互逻辑

// 学习数据
let studyData = {
    todayGoal: 20,
    todayCompleted: 13,
    streak: 7,
    studyTime: 25,
    totalWords: 1250,
    mastered: 938,
    accuracy: 85,
    wrongWords: 85
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    updateGreeting();
    updateDate();
    startAutoUpdate();
});

// 更新仪表盘
function updateDashboard() {
    // 更新进度环
    updateProgressRing();
    
    // 更新统计数据
    updateStats();
    
    // 更新错题本数量
    updateWrongWordsCount();
}

// 更新进度环
function updateProgressRing() {
    const progress = (studyData.todayCompleted / studyData.todayGoal) * 100;
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (progress / 100) * circumference;
    
    const progressCircle = document.querySelector('.hero-card circle:nth-child(2)');
    if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
    }
    
    // 更新数字
    const progressValue = document.querySelector('.progress-value');
    if (progressValue) {
        animateNumber(progressValue, 0, studyData.todayCompleted, 1000);
    }
    
    // 更新徽章
    const badge = document.querySelector('.hero-badge');
    if (badge) {
        badge.textContent = studyData.todayGoal + '词';
    }
    
    // 更新连续天数和学习时长
    const statItems = document.querySelectorAll('.hero-stats .stat-item span');
    if (statItems[0]) statItems[0].textContent = `连续${studyData.streak}天`;
    if (statItems[1]) statItems[1].textContent = `${studyData.studyTime}分钟`;
}

// 更新统计数据
function updateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers[0]) animateNumber(statNumbers[0], 0, studyData.totalWords, 1500);
    if (statNumbers[1]) animateNumber(statNumbers[1], 0, studyData.mastered, 1500);
    if (statNumbers[2]) statNumbers[2].textContent = studyData.accuracy + '%';
}

// 更新错题本数量
function updateWrongWordsCount() {
    const wrongCard = document.querySelector('.quick-card.warning .quick-subtitle');
    if (wrongCard) {
        wrongCard.textContent = `${studyData.wrongWords}个待复习`;
    }
}

// 数字动画
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// 更新问候语
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.querySelector('.greeting');
    
    if (!greetingEl) return;
    
    let greeting = '';
    if (hour < 6) {
        greeting = '夜深了 🌙';
    } else if (hour < 9) {
        greeting = '早上好 ☀️';
    } else if (hour < 12) {
        greeting = '上午好 👋';
    } else if (hour < 14) {
        greeting = '中午好 🌤️';
    } else if (hour < 18) {
        greeting = '下午好 ☕';
    } else if (hour < 22) {
        greeting = '晚上好 🌆';
    } else {
        greeting = '夜深了 🌙';
    }
    
    greetingEl.textContent = greeting;
}

// 更新日期显示
function updateDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[now.getDay()];
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const monthName = months[now.getMonth()];
    
    const dayEl = document.querySelector('.date-day');
    const monthEl = document.querySelector('.date-month');
    const weekdayEl = document.querySelector('.date-weekday');
    
    if (dayEl) dayEl.textContent = day;
    if (monthEl) monthEl.textContent = monthName;
    if (weekdayEl) weekdayEl.textContent = weekday;
}

// 自动更新
function startAutoUpdate() {
    // 每分钟更新一次问候语
    setInterval(updateGreeting, 60000);
    
    // 每5秒模拟学习进度更新（仅用于演示）
    setInterval(() => {
        if (studyData.todayCompleted < studyData.todayGoal) {
            // 随机增加进度（演示用）
            if (Math.random() > 0.95) {
                studyData.todayCompleted++;
                studyData.studyTime += Math.floor(Math.random() * 3) + 1;
                updateProgressRing();
                
                // 完成目标时显示祝贺
                if (studyData.todayCompleted === studyData.todayGoal) {
                    showCongratulations();
                }
            }
        }
    }, 5000);
}

// 显示祝贺动画
function showCongratulations() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    overlay.innerHTML = `
        <div style="
            background: white;
            border-radius: 28px;
            padding: 40px 30px;
            text-align: center;
            max-width: 300px;
            animation: scaleIn 0.4s;
        ">
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <div style="font-size: 24px; font-weight: 800; color: #007AFF; margin-bottom: 10px;">
                恭喜完成今日目标！
            </div>
            <div style="font-size: 14px; color: #8E8E93; margin-bottom: 20px;">
                坚持就是胜利，继续加油！
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #007AFF, #5AC8FA);
                color: white;
                border: none;
                border-radius: 20px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
            ">太棒了！</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 播放祝贺音效（如果有）
    playSound('congratulations');
}

// 播放音效
function playSound(type) {
    // 这里可以接入真实的音效API
    console.log('播放音效:', type);
}

// 快速开始卡片点击
function quickStart(mode) {
    switch(mode) {
        case 'learn':
            navigateTo('learn.html');
            break;
        case 'test':
            navigateTo('test.html');
            break;
        case 'review':
            navigateTo('learn.html?mode=review');
            break;
        case 'wrong':
            navigateTo('learn.html?mode=wrong');
            break;
    }
}
