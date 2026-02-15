var currentWordIndex = 4;
var totalWords = 20;
var isAnimating = false;

var wordsData = [
    {
        word: 'abandon',
        phoneticUS: 'US /əˈbændən/',
        phoneticUK: 'UK /əˈbændən/',
        type: 'v.',
        meaning: '放弃；抛弃；遗弃',
        tags: ['CET-4', '高频'],
        root: '<span class="root">a-</span> (离开) + <span class="root">band</span> (约束) + <span class="root">-on</span> (动词后缀)',
        examples: [
            'He had to <span class="highlight">abandon</span> his car in the snow.',
            'Don\'t <span class="highlight">abandon</span> hope.'
        ],
        synonyms: ['desert', 'forsake', 'give up', 'quit']
    },
    {
        word: 'ability',
        phoneticUS: 'US /əˈbɪləti/',
        phoneticUK: 'UK /əˈbɪləti/',
        type: 'n.',
        meaning: '能力；才能',
        tags: ['CET-4', '高频'],
        root: '<span class="root">able</span> (能够的) + <span class="root">-ity</span> (名词后缀)',
        examples: [
            'She has the <span class="highlight">ability</span> to speak three languages.',
            'His <span class="highlight">ability</span> in math is outstanding.'
        ],
        synonyms: ['capability', 'capacity', 'competence', 'skill']
    },
    {
        word: 'absent',
        phoneticUS: 'US /ˈæbsənt/',
        phoneticUK: 'UK /ˈæbsənt/',
        type: 'adj.',
        meaning: '缺席的；不在的',
        tags: ['CET-4'],
        root: '<span class="root">ab-</span> (离开) + <span class="root">sent</span> (存在)',
        examples: [
            'Three students were <span class="highlight">absent</span> from class today.',
            'He has been <span class="highlight">absent</span> for a week.'
        ],
        synonyms: ['away', 'missing', 'not present', 'gone']
    }
];

for (var i = 3; i < 20; i++) {
    wordsData.push({
        word: 'word' + (i + 1),
        phoneticUS: 'US /wɜːrd/',
        phoneticUK: 'UK /wɜːd/',
        type: 'n.',
        meaning: '单词 ' + (i + 1),
        tags: ['CET-4'],
        root: '<span class="root">word</span>',
        examples: ['Example 1', 'Example 2'],
        synonyms: ['term', 'expression']
    });
}

function toggleAI() {
    var content = document.getElementById('aiContent');
    var chevron = document.getElementById('aiChevron');
    var header = document.querySelector('.ai-header');
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        header.classList.remove('active');
    } else {
        content.classList.add('show');
        header.classList.add('active');
    }
}

function playSound(type) {
    console.log('play sound');
}

function toggleBookmark() {
    var btn = document.querySelector('.bookmark-btn');
    btn.classList.toggle('active');
}

function updateWordCard(wordData) {
    document.getElementById('wordText').textContent = wordData.word;
    document.getElementById('phoneticUS').textContent = wordData.phoneticUS;
    document.getElementById('phoneticUK').textContent = wordData.phoneticUK;
    document.getElementById('wordType').textContent = wordData.type;
    document.getElementById('meaningText').textContent = wordData.meaning;
    
    var wordTagsContainer = document.querySelector('.word-tags');
    if (wordTagsContainer) {
        wordTagsContainer.innerHTML = wordData.tags.map(function(tag) {
            return '<span class="tag">' + tag + '</span>';
        }).join('');
    }
    
    document.getElementById('rootContent').innerHTML = wordData.root;
    
    var exampleList = document.getElementById('exampleList');
    exampleList.innerHTML = wordData.examples.map(function(example) {
        return '<div class="example-item"><p>' + example + '</p><button class="play-btn"><i data-lucide="play"></i></button></div>';
    }).join('');
    
    var synonymTags = document.getElementById('synonymTags');
    synonymTags.innerHTML = wordData.synonyms.map(function(syn) {
        return '<span class="synonym-tag">' + syn + '</span>';
    }).join('');
    
    lucide.createIcons();
}

function previousWord() {
    if (isAnimating) return;
    
    if (currentWordIndex > 0) {
        isAnimating = true;
        var wordCard = document.getElementById('wordCard');
        wordCard.classList.add('slide-out-right');
        
        setTimeout(function() {
            currentWordIndex--;
            updateProgress();
            updateWordCard(wordsData[currentWordIndex]);
            wordCard.classList.remove('slide-out-right');
            wordCard.classList.add('slide-in-left');
            
            setTimeout(function() {
                wordCard.classList.remove('slide-in-left');
                isAnimating = false;
            }, 300);
        }, 300);
    }
}

function nextWord() {
    if (isAnimating) return;
    
    if (currentWordIndex < totalWords - 1) {
        isAnimating = true;
        var wordCard = document.getElementById('wordCard');
        wordCard.classList.add('slide-out-left');
        
        setTimeout(function() {
            currentWordIndex++;
            updateProgress();
            updateWordCard(wordsData[currentWordIndex]);
            wordCard.classList.remove('slide-out-left');
            wordCard.classList.add('slide-in-right');
            
            setTimeout(function() {
                wordCard.classList.remove('slide-in-right');
                isAnimating = false;
            }, 300);
        }, 300);
    } else {
        alert('Complete!');
        navigateTo('index.html');
    }
}

function updateProgress() {
    document.querySelector('.learn-progress .current').textContent = currentWordIndex + 1;
}

function toggleMenu() {
    alert('Menu');
}

var swipeStartX = 0;
var swipeEndX = 0;

document.addEventListener('DOMContentLoaded', function() {
    var wordCard = document.getElementById('wordCard');
    
    wordCard.addEventListener('touchstart', function(e) {
        swipeStartX = e.changedTouches[0].screenX;
    }, false);
    
    wordCard.addEventListener('touchend', function(e) {
        swipeEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
});

function handleSwipe() {
    var threshold = 50;
    
    if (swipeEndX < swipeStartX - threshold) {
        nextWord();
    }
    
    if (swipeEndX > swipeStartX + threshold) {
        previousWord();
    }
}
