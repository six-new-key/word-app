// 切换设置侧边栏
function toggleSettings() {
    const sidebar = document.getElementById('settingsSidebar');
    sidebar.classList.toggle('active');
}

// 切换夜间模式
function toggleNightMode() {
    document.body.classList.toggle('night-mode');
    const isNight = document.body.classList.contains('night-mode');
    localStorage.setItem('nightMode', isNight);
}

// 页面跳转
function navigateTo(page) {
    window.location.href = page;
}

// 页面加载时恢复夜间模式设置
window.addEventListener('DOMContentLoaded', () => {
    const nightMode = localStorage.getItem('nightMode') === 'true';
    if (nightMode) {
        document.body.classList.add('night-mode');
    }
});

// AI搭子点击提示
function showAITip() {
    alert('加油！今天也要好好学习哦 💪');
}

// 滑动手势处理
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe(element, leftCallback, rightCallback) {
    element.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    element.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture(leftCallback, rightCallback);
    });
}

function handleSwipeGesture(leftCallback, rightCallback) {
    if (touchEndX < touchStartX - 50) {
        leftCallback && leftCallback();
    }
    if (touchEndX > touchStartX + 50) {
        rightCallback && rightCallback();
    }
}
