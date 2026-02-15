// AI聊天页交互逻辑

// 聊天历史
let chatHistory = [];

// AI回复模板
const aiResponses = {
    greeting: [
        '你好！我是你的AI学习助手 👋',
        '很高兴见到你！有什么可以帮助你的吗？',
        '嗨！准备好开始学习了吗？'
    ],
    plan: [
        '根据你的学习进度，我建议：\n1. 每天学习20个新单词\n2. 复习30个旧单词\n3. 重点关注易错词',
        '让我为你制定一个学习计划：\n- 早上：学习新词10个\n- 中午：复习昨天的词\n- 晚上：测试和巩固',
        '好的！我会根据你的学习数据制定个性化计划。'
    ],
    analysis: [
        '你的学习数据分析：\n✓ 本周学习效率提升20%\n✓ 词汇掌握率85%\n✓ 建议加强词根记忆',
        '数据显示你在词义辨析方面表现优秀！继续保持！',
        '分析完成！你的强项是词根记忆，弱项是拼写，建议多做拼写练习。'
    ],
    recommend: [
        '根据你的水平，我推荐：\n1. CET-6核心词汇\n2. 商务英语词汇\n3. 日常生活词汇',
        '这些词库很适合你：\n- TOEFL核心词汇\n- 学术英语词汇',
        '推荐你学习商务英语词汇，这对你的职业发展很有帮助！'
    ],
    tips: [
        '记忆技巧分享：\n1. 词根词缀法\n2. 联想记忆法\n3. 间隔重复法',
        '试试这个方法：将单词与图像关联，会记得更牢！',
        '每天固定时间学习，养成习惯很重要哦！'
    ],
    encourage: [
        '你今天的学习状态很棒！继续加油！💪',
        '坚持就是胜利！你已经连续学习7天了！',
        '每一个单词都是进步，相信自己！'
    ],
    default: [
        '我理解你的问题，让我想想...',
        '这是个好问题！',
        '我会尽力帮助你的！'
    ]
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initChat();
    loadChatHistory();
});

// 初始化聊天
function initChat() {
    // 如果没有聊天记录，显示欢迎消息
    if (chatHistory.length === 0) {
        addWelcomeMessage();
    }
}

// 添加欢迎消息
function addWelcomeMessage() {
    const welcomeMsg = {
        type: 'ai',
        content: '你好！我是你的AI学习助手 👋\n\n我可以帮你：\n• 解答单词疑问\n• 制定学习计划\n• 分析学习数据\n• 提供记忆技巧',
        timestamp: new Date()
    };
    
    chatHistory.push(welcomeMsg);
    saveChatHistory();
}

// 加载聊天历史
function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        chatHistory = JSON.parse(saved);
    }
}

// 保存聊天历史
function saveChatHistory() {
    // 只保留最近50条消息
    if (chatHistory.length > 50) {
        chatHistory = chatHistory.slice(-50);
    }
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// 发送消息
function sendMessage(text) {
    const input = document.getElementById('chatInput');
    const message = text || input.value.trim();
    
    if (!message) return;
    
    // 清空输入框
    if (!text) input.value = '';
    
    // 添加用户消息
    addMessage('user', message);
    
    // 显示输入中状态
    showTyping();
    
    // 模拟AI思考时间
    setTimeout(() => {
        hideTyping();
        const aiReply = generateAIReply(message);
        addMessage('ai', aiReply);
    }, 1000 + Math.random() * 1000);
}

// 添加消息
function addMessage(type, content) {
    const messagesContainer = document.querySelector('.chat-messages');
    
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    if (type === 'ai') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i data-lucide="sparkles"></i>
            </div>
            <div class="message-bubble">
                ${formatMessage(content)}
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${formatMessage(content)}
            </div>
        `;
    }
    
    // 移除快捷回复（如果存在）
    const quickReplies = document.querySelector('.quick-replies');
    if (quickReplies) {
        quickReplies.remove();
    }
    
    // 添加到容器
    messagesContainer.appendChild(messageDiv);
    
    // 重新初始化图标
    lucide.createIcons();
    
    // 滚动到底部
    scrollToBottom();
    
    // 保存到历史
    chatHistory.push({
        type,
        content,
        timestamp: new Date()
    });
    saveChatHistory();
    
    // 如果是AI消息，添加快捷回复
    if (type === 'ai') {
        addQuickReplies();
    }
}

// 格式化消息
function formatMessage(content) {
    // 将换行符转换为<br>
    content = content.replace(/\n/g, '<br>');
    
    // 将列表项转换为<li>
    content = content.replace(/[•·]/g, '<br>•');
    
    return `<p>${content}</p>`;
}

// 生成AI回复
function generateAIReply(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // 关键词匹配
    if (msg.includes('计划') || msg.includes('规划')) {
        return getRandomResponse('plan');
    } else if (msg.includes('分析') || msg.includes('数据') || msg.includes('统计')) {
        return getRandomResponse('analysis');
    } else if (msg.includes('推荐') || msg.includes('词库')) {
        return getRandomResponse('recommend');
    } else if (msg.includes('方法') || msg.includes('技巧') || msg.includes('怎么')) {
        return getRandomResponse('tips');
    } else if (msg.includes('加油') || msg.includes('鼓励') || msg.includes('坚持')) {
        return getRandomResponse('encourage');
    } else if (msg.includes('你好') || msg.includes('hi') || msg.includes('hello')) {
        return getRandomResponse('greeting');
    } else {
        // 默认回复
        return getRandomResponse('default') + '\n\n' + getRandomResponse('tips');
    }
}

// 获取随机回复
function getRandomResponse(category) {
    const responses = aiResponses[category] || aiResponses.default;
    return responses[Math.floor(Math.random() * responses.length)];
}

// 显示输入中状态
function showTyping() {
    const messagesContainer = document.querySelector('.chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i data-lucide="sparkles"></i>
        </div>
        <div class="message-bubble">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    lucide.createIcons();
    scrollToBottom();
}

// 隐藏输入中状态
function hideTyping() {
    const typing = document.querySelector('.typing-indicator');
    if (typing) {
        typing.remove();
    }
}

// 添加快捷回复
function addQuickReplies() {
    const messagesContainer = document.querySelector('.chat-messages');
    
    // 移除旧的快捷回复
    const oldReplies = document.querySelector('.quick-replies');
    if (oldReplies) {
        oldReplies.remove();
    }
    
    const quickReplies = document.createElement('div');
    quickReplies.className = 'quick-replies';
    quickReplies.innerHTML = `
        <button class="quick-reply" onclick="sendMessage('制定学习计划')">制定学习计划</button>
        <button class="quick-reply" onclick="sendMessage('分析我的数据')">分析我的数据</button>
        <button class="quick-reply" onclick="sendMessage('推荐词库')">推荐词库</button>
    `;
    
    messagesContainer.appendChild(quickReplies);
    scrollToBottom();
}

// 滚动到底部
function scrollToBottom() {
    const content = document.querySelector('.chat-content');
    setTimeout(() => {
        content.scrollTop = content.scrollHeight;
    }, 100);
}

// 显示菜单
function showMenu() {
    const options = ['清空聊天记录', '导出聊天记录', '取消'];
    const choice = prompt('请选择操作：\n1. 清空聊天记录\n2. 导出聊天记录\n0. 取消', '0');
    
    switch(choice) {
        case '1':
            clearChat();
            break;
        case '2':
            exportChat();
            break;
    }
}

// 清空聊天记录
function clearChat() {
    if (confirm('确定要清空所有聊天记录吗？')) {
        chatHistory = [];
        saveChatHistory();
        document.querySelector('.chat-messages').innerHTML = '';
        addWelcomeMessage();
        location.reload();
    }
}

// 导出聊天记录
function exportChat() {
    const text = chatHistory.map(msg => {
        const time = new Date(msg.timestamp).toLocaleString();
        const sender = msg.type === 'ai' ? 'AI助手' : '我';
        return `[${time}] ${sender}: ${msg.content}`;
    }).join('\n\n');
    
    // 复制到剪贴板
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('聊天记录已复制到剪贴板！');
        });
    } else {
        alert(text);
    }
}

// 回车发送
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chatInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
