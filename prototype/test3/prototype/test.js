// 测试页交互逻辑
let selectedAnswer = null;
let currentQuestion = 5;
const totalQuestions = 10;

// 选择选项
function selectOption(element, option) {
    // 移除之前的选中状态
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 添加选中状态
    element.classList.add('selected');
    selectedAnswer = option;
    
    // 启用提交按钮
    document.getElementById('submitBtn').disabled = false;
}

// 跳过题目
function skipQuestion() {
    if (confirm('确定要跳过这道题吗？')) {
        nextQuestion();
    }
}

// 提交答案
function submitAnswer() {
    if (!selectedAnswer) {
        alert('请先选择一个答案');
        return;
    }
    
    // 这里可以验证答案
    console.log('提交答案:', selectedAnswer);
    
    // 进入下一题
    setTimeout(() => {
        nextQuestion();
    }, 500);
}

// 下一题
function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        updateProgress();
        resetQuestion();
    } else {
        // 显示测试结果
        showResult();
    }
}

// 更新进度
function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.querySelector('.test-progress-fill').style.width = progress + '%';
    document.querySelector('.test-counter').textContent = currentQuestion + '/' + totalQuestions;
}

// 重置题目
function resetQuestion() {
    selectedAnswer = null;
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.getElementById('submitBtn').disabled = true;
}

// 显示结果
function showResult() {
    document.getElementById('testResult').style.display = 'flex';
}

// 关闭结果
function closeResult() {
    navigateTo('index.html');
}

// 查看错题
function viewErrors() {
    alert('查看错题功能');
}

// 重新测试
function retakeTest() {
    currentQuestion = 1;
    updateProgress();
    resetQuestion();
    document.getElementById('testResult').style.display = 'none';
}
