// DOM Elements
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('main-content');
const openBtn = document.getElementById('open-btn');
const scIframe = document.getElementById('sc-widget');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');

// Initialize SoundCloud
let widget;

// Function to init widget
const initWidget = () => {
    if (typeof SC === 'undefined') {
        console.warn('SC not defined yet, retrying...');
        setTimeout(initWidget, 500);
        return;
    }

    try {
        widget = SC.Widget(scIframe);
        widget.bind(SC.Widget.Events.READY, () => {
            widgetReady = true;
            widget.setVolume(80);
            console.log('SC Widget Ready via robust init');
        });

        widget.bind(SC.Widget.Events.PLAY, () => {
            isPlaying = true;
            musicIcon.className = 'fas fa-compact-disc fa-spin text-xl';
        });

        widget.bind(SC.Widget.Events.PAUSE, () => {
            isPlaying = false;
            musicIcon.className = 'fas fa-music text-xl';
        });

        widget.bind(SC.Widget.Events.ERROR, () => {
            console.error('SC Widget Error - Relinking...');
            scIframe.src = scIframe.src;
        });
    } catch (e) {
        console.error('SC Init Error', e);
    }
};

// Start init on load
window.addEventListener('load', initWidget);

let widgetReady = false;
let isPlaying = false;

// Music Toggle Click
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        widget.pause();
    } else {
        widget.play();
    }
});

// Animation helper
const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.reveal-hidden');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - 150) {
            el.classList.add('reveal-visible');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Rose Particles
const createPetal = () => {
    const container = document.getElementById('rose-particles');
    if (!container) return;
    const petal = document.createElement('div');
    petal.className = 'absolute text-rose-petal/60 animate-petal-fall pointer-events-none z-[50]';
    petal.style.fontSize = `${Math.random() * 20 + 10}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
    petal.innerHTML = '<i class="fas fa-spa"></i>';
    container.appendChild(petal);
    setTimeout(() => petal.remove(), 10000);
};

// Open Invitation Logic
openBtn.addEventListener('click', () => {
    // 1. Play Music (Aggressive)
    const playMusic = () => {
        if (widget) {
            widget.play();
            console.log('Trying to play...');
        }
    };
    playMusic();
    setTimeout(playMusic, 500);
    setTimeout(playMusic, 1500);
    setTimeout(playMusic, 3000);

    // 2. Hide Overlay
    overlay.style.opacity = '0';
    overlay.style.transform = 'scale(1.2) translateZ(200px) rotateX(10deg)';

    setTimeout(() => {
        overlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        musicToggle.classList.remove('hidden'); // Show toggle

        setTimeout(() => {
            mainContent.classList.remove('opacity-0');
            mainContent.classList.add('opacity-100');
            revealOnScroll();
            setInterval(createPetal, 1000);
        }, 100);
    }, 1500);
});

// Countdown
const targetDate = new Date("Feb 12, 2026 15:00:00").getTime();
const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) return;

    document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
};
setInterval(updateCountdown, 1000);
updateCountdown();

// 3D Card
const card = document.getElementById('opening-card');
if (card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = (e.clientY - rect.top - rect.height / 2) / 10;
        const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 10;
        card.querySelector('.preserve-3d').style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.querySelector('.preserve-3d').style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
}
