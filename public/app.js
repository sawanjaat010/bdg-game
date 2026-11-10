// BDG WIN - Official Interactive Web Engine

let isLoggedIn = false;
let currentSlideIndex = 0;
let bannerTimer = null;

// 1. Banner Carousel Engine (4 HD Slides)
function initBannerCarousel() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dots .dot');
    if (!slides.length) return;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentSlideIndex = (index + slides.length) % slides.length;
        slides[currentSlideIndex].classList.add('active');
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active');
        }
    }

    window.goToSlide = function(index) {
        clearInterval(bannerTimer);
        showSlide(index);
        startAutoRotation();
    };

    function startAutoRotation() {
        bannerTimer = setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, 3600);
    }

    startAutoRotation();
}

// 2. Live Winners Data Pool (Exact BDG Format)
const winnersData = [
    { user: 'Mem***X00', game: 'Fortune Gems', badge: '/assets/extracted/pop_fortune_gems.png', amount: '288.00' },
    { user: 'Mem***0ZA', game: 'Money Coming', badge: '/assets/extracted/pop_money_coming.png', amount: '550.00' },
    { user: 'Mem***MMB', game: 'Golden Joker', badge: '/assets/extracted/pop_crazy777.png', amount: '280.00' },
    { user: 'Mem***CTN', game: 'Fortune Gems', badge: '/assets/extracted/pop_fortune_gems2.png', amount: '6,000.00' },
    { user: 'Mem***CMX', game: 'Fortune Gems', badge: '/assets/extracted/pop_fortune_gems.png', amount: '1,600.00' },
    { user: 'Mem***UPQ', game: 'Aviator', badge: '/assets/extracted/rec_aviator.png', amount: '1,485.00' },
    { user: 'Mem***IOF', game: 'Aviator', badge: '/assets/extracted/rec_aviator.png', amount: '1,109.20' },
    { user: 'Mem***BEQ', game: 'Aviator', badge: '/assets/extracted/rec_aviator.png', amount: '110.16' },
    { user: 'Mem***ZOD', game: 'K3 Dice', badge: '/assets/extracted/card_lottery_k3.png', amount: '203.21' },
    { user: 'Mem***AVI', game: 'Win Go', badge: '/assets/extracted/card_lottery_wingo.png', amount: '1,960.00' },
    { user: 'Mem***TGD', game: 'Pro Aviator', badge: '/assets/extracted/rec_aviator.png', amount: '768.00' },
    { user: 'Mem***QEO', game: 'Dragon Tiger', badge: '/assets/extracted/pop_color_game.png', amount: '200.00' }
];

const avatarsPool = [
    '/assets/extracted/rank4.png',
    '/assets/extracted/rank5.png',
    '/assets/extracted/rank6.png',
    '/assets/extracted/rank7.png',
    '/assets/extracted/rank8.png',
    '/assets/extracted/rank9.png',
    '/assets/extracted/rank10.png'
];

function initWinningFeed() {
    const feed = document.getElementById('winning-feed');
    if (!feed) return;

    feed.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const item = winnersData[i];
        const avatar = avatarsPool[i % avatarsPool.length];
        feed.appendChild(createWinnerRow(item, avatar));
    }

    setInterval(() => {
        const randomItem = winnersData[Math.floor(Math.random() * winnersData.length)];
        const randomAvatar = avatarsPool[Math.floor(Math.random() * avatarsPool.length)];
        
        const amountVar = (parseFloat(randomItem.amount.replace(/,/g, '')) * (0.8 + Math.random() * 0.5)).toFixed(2);
        const dynamicItem = { ...randomItem, amount: Number(amountVar).toLocaleString('en-IN', { minimumFractionDigits: 2 }) };

        const newRow = createWinnerRow(dynamicItem, randomAvatar);
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(-10px)';
        feed.insertBefore(newRow, feed.firstChild);

        setTimeout(() => {
            newRow.style.transition = 'all 0.4s ease';
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
        }, 50);

        if (feed.children.length > 5) {
            feed.removeChild(feed.lastChild);
        }
    }, 2800);
}

function createWinnerRow(data, avatar) {
    const row = document.createElement('div');
    row.className = 'winner-row';
    row.innerHTML = `
        <img src="${avatar}" alt="User" class="winner-avatar">
        <div class="winner-user">${data.user}</div>
        <img src="${data.badge}" alt="${data.game}" class="winner-game-badge">
        <div class="winner-payout">
            <div class="payout-receive">Receive ₹${data.amount}</div>
            <div class="payout-lbl">Winning amount</div>
        </div>
    `;
    return row;
}

// 3. Category Switcher (Same Page SPA Tab switching)
function switchCategory(catName) {
    // Reset all category card active states
    document.querySelectorAll('.bdg-cat-card, .cat-section, .bdg-cat-card-h').forEach(el => {
        if (el.dataset.cat === catName) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Hide all subcategory sections
    document.querySelectorAll('.subcat-content').forEach(sub => sub.classList.remove('active'));

    // Show the target category section
    const target = document.getElementById(`subcat-${catName}`);
    if (target) {
        target.classList.add('active');
    }

    // Keep URL hash intact as required
    if (window.location.hash !== '#/') {
        history.replaceState(null, null, '#/');
    }
}

// 4. Bottom Sheet Login Prompt Engine (Exact match to screenshot media_1794293384004_434d1c98.jpg)
function openLoginSheet() {
    const sheet = document.getElementById('login-sheet');
    if (sheet) sheet.classList.add('active');
}

function closeLoginSheet() {
    const sheet = document.getElementById('login-sheet');
    if (sheet) sheet.classList.remove('active');
}

function requireLogin(feature) {
    if (!isLoggedIn) {
        openLoginSheet();
        return false;
    }
    return true;
}

function handleGameClick(gameTitle) {
    if (!isLoggedIn) {
        openLoginSheet();
        return;
    }
    launchGame(gameTitle);
}

function openAuthModal() {
    closeLoginSheet();
    document.getElementById('auth-modal').classList.add('active');
}

function performLogin() {
    const phone = document.getElementById('login-phone').value;
    isLoggedIn = true;
    closeModals();
    showToast('Login Successful! Welcome to BDG WIN');
}

// 5. 1:1 Pixel-Perfect Bottom Navigation Switcher (Swaps Active/Inactive Icons and Yellow Glow)
function switchNav(navKey) {
    const tabs = ['home', 'activity', 'promotion', 'account'];
    
    tabs.forEach(tab => {
        const item = document.getElementById(`nav-${tab}`);
        const icon = document.getElementById(`icon-${tab}`);
        if (!item || !icon) return;

        if (tab === navKey) {
            item.classList.add('active');
            icon.src = `/assets/nav/${tab}_active.png`;
        } else {
            item.classList.remove('active');
            icon.src = `/assets/nav/${tab}_inactive.png`;
        }
    });

    // If views exist, switch active view
    document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(`view-${navKey}`);
    if (targetView) targetView.classList.add('active');

    const appContent = document.querySelector('.app-content');
    if (appContent) appContent.scrollTop = 0;
}

// 5b. Exact BDG Vertical 2-Line Notice Ticker Engine
function initNoticeSlider() {
    const slider = document.getElementById('notice-slider');
    if (!slider) return;

    let noticeIndex = 0;
    const items = slider.querySelectorAll('.vertical-notice-item');
    const total = items.length;
    if (total <= 1) return;

    setInterval(() => {
        noticeIndex = (noticeIndex + 1) % total;
        slider.style.transform = `translateY(-${noticeIndex * 32}px)`;
    }, 3800);
}

// 6. Lucky Wheel ("Get ₹500") Logic
let isSpinning = false;
let currentRotation = 0;

function openWheelModal() {
    document.getElementById('wheel-modal').classList.add('active');
    document.getElementById('wheel-result-msg').innerText = '';
}

function closeWheelModal() {
    document.getElementById('wheel-modal').classList.remove('active');
}

function spinWheel() {
    if (!isLoggedIn) {
        closeWheelModal();
        openLoginSheet();
        return;
    }
    if (isSpinning) return;
    isSpinning = true;

    const disc = document.getElementById('wheel-disc');
    const spinBtn = document.getElementById('spin-btn');
    const resultMsg = document.getElementById('wheel-result-msg');

    spinBtn.disabled = true;
    spinBtn.style.opacity = '0.7';
    resultMsg.innerText = 'Spinning... Good Luck!';

    const extraSpins = 1800 + Math.floor(Math.random() * 360);
    currentRotation += extraSpins;
    disc.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.style.opacity = '1';
        
        resultMsg.innerHTML = '🎉 Congratulations! You won <strong style="color:#f7d27e;">₹500</strong> Bonus!';
        showToast('₹500 Bonus added to balance!');

        const balEl = document.getElementById('user-balance');
        if (balEl) {
            let current = parseFloat(balEl.innerText.replace(/[₹,\s]/g, '')) || 5820.50;
            current += 500;
            balEl.innerText = '₹ ' + current.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        }
    }, 4100);
}

// 7. Game Launcher Modal & Live Countdown
let countdownInterval;

function launchGame(gameTitle) {
    document.getElementById('modal-game-title').innerText = gameTitle;
    document.getElementById('game-modal').classList.add('active');

    let seconds = 24;
    const countEl = document.getElementById('game-countdown');
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) seconds = 30;
        countEl.innerText = '00:' + (seconds < 10 ? '0' + seconds : seconds);
    }, 1000);
}

function closeGameModal() {
    document.getElementById('game-modal').classList.remove('active');
    if (countdownInterval) clearInterval(countdownInterval);
}

function placeDemoBet(choice) {
    showToast(`Bet ₹100 placed on ${choice}!`);
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    closeLoginSheet();
    if (countdownInterval) clearInterval(countdownInterval);
}

// 8. Utilities
function showToast(msg) {
    const toast = document.getElementById('toast-box');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

function copyInviteCode() {
    const code = document.getElementById('invite-code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Invite code copied: ' + code);
    }).catch(() => {
        showToast('Code copied: ' + code);
    });
}

function installPWA() {
    showToast('Add to Home Screen initiated!');
}

function openDownloadModal() {
    showToast('Downloading BDG WIN official APK...');
}

function openNoticeModal() {
    showToast('Official notice: Please keep your bank card details verified.');
}

function openSupportChat() {
    showToast('Connecting to 24/7 Live Customer Service...');
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModals();
    }
});

// Auto-boot
document.addEventListener('DOMContentLoaded', () => {
    initBannerCarousel();
    initNoticeSlider();
    initWinningFeed();
    
    if (!window.location.hash) {
        history.replaceState(null, null, '#/');
    }
});
