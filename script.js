// Typing Animation
const typingTitle = document.getElementById('typing-title');
const fullText = 'BATMAN';
let currentIndex = 0;

function typeTitle() {
    if (currentIndex < fullText.length) {
        typingTitle.textContent += fullText[currentIndex];
        currentIndex++;
        setTimeout(typeTitle, 150);
    }
}

// Start typing after loader fades
setTimeout(typeTitle, 2500);

// Generate Stars
function generateStars() {
    const starsContainer = document.querySelector('.stars');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

generateStars();

// Access Files Button
const enterButton = document.getElementById('enterButton');
const loader = document.getElementById('loader');
let currentSection = 0;

enterButton.addEventListener('click', () => {
    // Hide hero and loader
    document.querySelector('.hero').style.display = 'none';
    loader.style.display = 'none';

    // Show first hidden section
    showNextSection();
});

function showNextSection() {
    const hiddenSections = document.querySelectorAll('section.hidden');

    if (currentSection < hiddenSections.length) {
        hiddenSections[currentSection].classList.add('active');
        currentSection++;
    }
}

// Music Control
const musicBtn = document.getElementById('musicBtn');
const music = document.getElementById('music');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        musicBtn.style.opacity = '0.6';
    } else {
        music.play();
        musicBtn.style.opacity = '1';
    }
    isPlaying = !isPlaying;
});

// Auto-play music (some browsers require user interaction first)
music.addEventListener('play', () => {
    isPlaying = true;
    musicBtn.style.opacity = '1';
});

music.addEventListener('pause', () => {
    isPlaying = false;
    musicBtn.style.opacity = '0.6';
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        showNextSection();
    }
    if (e.key === 'm' || e.key === 'M') {
        musicBtn.click();
    }
});
