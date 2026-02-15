// 词库页交互逻辑

// 词库数据
const libraries = [
    {
        id: 1,
        name: 'CET-4 核心词汇',
        count: 2000,
        learned: 450,
        category: '考试',
        icon: 'graduation-cap',
        color: 'cet4'
    },
    {
        id: 2,
        name: 'CET-6 高频词汇',
        count: 1500,
        learned: 120,
        category: '考试',
        icon: 'award',
        color: 'cet6'
    },
    {
        id: 3,
        name: 'TOEFL 核心词汇',
        count: 4000,
        learned: 0,
        category: '考试',
        icon: 'globe',
        color: 'toefl'
    },
    {
        id: 4,
        name: '商务英语词汇',
        count: 1200,
        learned: 800,
        category: '商务',
        icon: 'briefcase',
        color: 'business'
    },
    {
        id: 5,
        name: '日常生活词汇',
        count: 800,
        learned: 650,
        category: '生活',
        icon: 'coffee',
        color: 'daily'
    },
    {
        id: 6,
        name: '我的收藏',
        count: 85,
        learned: 38,
        category: '自定义',
        icon: 'star',
        color: 'custom'
    }
];

let currentCategory = '全部';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initCategoryTabs();
    renderLibraries();
});

// 初始化分类标签
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active
            tabs.forEach(t => t.classList.remove('active'));
            // 添加当前active
            tab.classList.add('active');
            // 更新当前分类
            currentCategory = tab.textContent;
            // 重新渲染词库列表
            renderLibraries();
        });
    });
}

// 渲染词库列表
function renderLibraries() {
    const libraryList = document.querySelector('.library-list');
    
    // 筛选词库
    let filteredLibraries = libraries;
    if (currentCategory !== '全部') {
        filteredLibraries = libraries.filter(lib => lib.category === currentCategory);
    }
    
    // 生成HTML
    libraryList.innerHTML = filteredLibraries.map(lib => {
        const progress = lib.count > 0 ? (lib.learned / lib.count * 100).toFixed(1) : 0;
        const progressText = lib.learned > 0 ? `已学 ${lib.learned}` : '未开始';
        
        return `
            <div class="library-card" onclick="navigateTo('library-detail.html?id=${lib.id}')">
                <div class="library-icon ${lib.color}">
                    <i data-lucide="${lib.icon}"></i>
                </div>
                <div class="library-info">
                    <div class="library-name">${lib.name}</div>
                    <div class="library-meta">
                        <span class="word-count">${lib.count}词</span>
                        <span class="progress-text">${progressText}</span>
                    </div>
                    <div class="library-progress">
                        <div class="library-progress-bar" style="width: ${progress}%"></div>
                    </div>
                </div>
                <button class="library-action" onclick="event.stopPropagation(); startLearn(${lib.id})">
                    <i data-lucide="play"></i>
                </button>
            </div>
        `;
    }).join('');
    
    // 重新初始化图标
    lucide.createIcons();
}

// 搜索功能
function showSearch() {
    const keyword = prompt('请输入搜索关键词：');
    if (keyword) {
        const results = libraries.filter(lib => 
            lib.name.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (results.length > 0) {
            alert(`找到 ${results.length} 个词库：\n${results.map(r => r.name).join('\n')}`);
        } else {
            alert('未找到相关词库');
        }
    }
}

// 开始学习
function startLearn(id) {
    const library = libraries.find(lib => lib.id === id);
    if (library) {
        if (library.learned === 0) {
            if (confirm(`开始学习《${library.name}》？`)) {
                navigateTo('learn.html?library=' + id);
            }
        } else {
            navigateTo('learn.html?library=' + id);
        }
    }
}
