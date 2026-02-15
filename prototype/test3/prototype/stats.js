// 统计页交互逻辑

// 模拟数据
const statsData = {
    '7天': {
        totalWords: 1250,
        mastered: 938,
        accuracy: 85,
        studyTime: 42,
        trend: [15, 23, 18, 31, 27, 19, 25],
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    '30天': {
        totalWords: 1250,
        mastered: 938,
        accuracy: 85,
        studyTime: 42,
        trend: [12, 18, 15, 25, 20, 28, 22, 30],
        labels: ['第1周', '第2周', '第3周', '第4周']
    },
    '90天': {
        totalWords: 1250,
        mastered: 938,
        accuracy: 82,
        studyTime: 120,
        trend: [45, 52, 48, 60, 55, 68, 62, 75],
        labels: ['1月', '2月', '3月']
    },
    '全部': {
        totalWords: 1250,
        mastered: 938,
        accuracy: 80,
        studyTime: 180,
        trend: [100, 180, 250, 380, 520, 680, 820, 938],
        labels: ['开始', '1个月', '2个月', '3个月', '4个月', '5个月', '6个月', '现在']
    }
};

let currentPeriod = '30天';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initTimeFilter();
    updateStats();
});

// 初始化时间筛选
function initTimeFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有active
            filterBtns.forEach(b => b.classList.remove('active'));
            // 添加当前active
            btn.classList.add('active');
            // 更新当前时间段
            currentPeriod = btn.textContent;
            // 更新统计数据
            updateStats();
        });
    });
}

// 更新统计数据
function updateStats() {
    const data = statsData[currentPeriod];
    
    // 更新核心数据
    document.querySelectorAll('.core-stat-value')[0].textContent = data.totalWords.toLocaleString();
    document.querySelectorAll('.core-stat-value')[1].textContent = data.mastered.toLocaleString();
    document.querySelectorAll('.core-stat-value')[2].textContent = data.accuracy + '%';
    document.querySelectorAll('.core-stat-value')[3].textContent = data.studyTime + 'h';
    
    // 更新图表
    updateTrendChart(data.trend);
    
    // 更新图表副标题
    document.querySelector('.chart-subtitle').textContent = '近' + currentPeriod;
}

// 更新趋势图
function updateTrendChart(trendData) {
    const svg = document.querySelector('.chart-container svg');
    const width = 320;
    const height = 180;
    const padding = 30;
    const chartHeight = height - padding;
    
    // 计算最大值
    const maxValue = Math.max(...trendData);
    const minValue = Math.min(...trendData);
    const range = maxValue - minValue || 1;
    
    // 计算点的位置
    const points = trendData.map((value, index) => {
        const x = (width / (trendData.length - 1)) * index;
        const y = chartHeight - ((value - minValue) / range) * (chartHeight - padding);
        return { x, y };
    });
    
    // 生成路径
    const linePath = points.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
    ).join(' ');
    
    const areaPath = `M 0,${chartHeight} ${linePath} L ${width},${chartHeight} Z`;
    
    // 更新SVG
    svg.innerHTML = `
        <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#007AFF;stop-opacity:0.3"/>
                <stop offset="100%" style="stop-color:#007AFF;stop-opacity:0"/>
            </linearGradient>
        </defs>
        <!-- 网格线 -->
        <line x1="0" y1="150" x2="320" y2="150" stroke="#E5E5EA" stroke-width="1"/>
        <line x1="0" y1="110" x2="320" y2="110" stroke="#E5E5EA" stroke-width="1"/>
        <line x1="0" y1="70" x2="320" y2="70" stroke="#E5E5EA" stroke-width="1"/>
        <line x1="0" y1="30" x2="320" y2="30" stroke="#E5E5EA" stroke-width="1"/>
        <!-- 面积图 -->
        <path d="${areaPath}" fill="url(#areaGradient)"/>
        <!-- 折线 -->
        <polyline points="${points.map(p => `${p.x},${p.y}`).join(' ')}" 
                  fill="none" stroke="#007AFF" stroke-width="3" stroke-linecap="round"/>
        <!-- 最后一个数据点 -->
        <circle cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" r="5" fill="#007AFF"/>
    `;
}

// 分享统计
function shareStats() {
    const data = statsData[currentPeriod];
    const text = `我在背单词APP已经掌握了${data.mastered}个单词，正确率${data.accuracy}%！💪`;
    
    if (navigator.share) {
        navigator.share({
            title: '我的学习统计',
            text: text
        }).catch(err => {
            console.log('分享失败', err);
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板！');
        });
    } else {
        alert(text);
    }
}
