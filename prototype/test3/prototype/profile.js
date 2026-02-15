// 个人中心页交互逻辑

// 用户数据
let userData = {
    name: '学习达人',
    level: 8,
    levelName: '词汇大师',
    totalWords: 1250,
    mastered: 938,
    streak: 7,
    studyDays: 127,
    studyTime: 2580, // 分钟
    wrongWords: 85,
    avatar: null
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    updateProfile();
});

// 加载用户数据
function loadUserData() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        userData = { ...userData, ...JSON.parse(savedData) };
    }
}

// 更新个人资料显示
function updateProfile() {
    // 更新用户名
    const nameEl = document.querySelector('.profile-name');
    if (nameEl) nameEl.textContent = userData.name;
    
    // 更新等级
    const levelEl = document.querySelector('.profile-level span');
    if (levelEl) levelEl.textContent = `Lv.${userData.level} ${userData.levelName}`;
    
    // 更新统计数据
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues[0]) animateNumber(statValues[0], 0, userData.totalWords, 1000);
    if (statValues[1]) animateNumber(statValues[1], 0, userData.mastered, 1000);
    if (statValues[2]) statValues[2].textContent = userData.streak + '天';
    
    // 更新错题本数量
    const badge = document.querySelector('.badge');
    if (badge) badge.textContent = userData.wrongWords;
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

// 编辑个人信息
function editProfile() {
    const newName = prompt('请输入新的昵称：', userData.name);
    if (newName && newName.trim()) {
        userData.name = newName.trim();
        saveUserData();
        updateProfile();
        showToast('昵称已更新');
    }
}

// 保存用户数据
function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除用户数据（保留设置）
        localStorage.removeItem('userData');
        
        // 显示退出动画
        showLogoutAnimation();
        
        // 延迟跳转到登录页
        setTimeout(() => {
            // 这里应该跳转到登录页，现在跳回首页
            window.location.href = 'index.html';
        }, 1500);
    }
}

// 显示退出动画
function showLogoutAnimation() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="font-size: 48px; margin-bottom: 20px;">👋</div>
            <div style="font-size: 20px; font-weight: 600;">再见，期待下次见面！</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// 显示提示
function showToast(message) {
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
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 菜单项点击统计
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const text = item.querySelector('span').textContent;
        console.log('点击菜单:', text);
        
        // 如果是未实现的功能，显示提示
        if (item.getAttribute('href') === '#') {
            e.preventDefault();
            showToast('功能开发中...');
        }
    });
});
