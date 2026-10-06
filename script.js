// --- LOGIKA PERPINDAHAN TAB ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
        if(btn.dataset.target === 'profile-tab') {
            renderProfileUI();
        }
    });
});

// --- DATA AVATAR & LEVEL (KELIPATAN 50 HINGGA 500) ---
const AVATAR_LEVELS = [
    { level: 0, required: 0, title: "Novice Calculator", emoji: "🌱" },
    { level: 50, required: 50, title: "Math Apprentice", emoji: "📘" },
    { level: 100, required: 100, title: "Number Hunter", emoji: "⚡" },
    { level: 150, required: 150, title: "Algebra Striker", emoji: "🛡️" },
    { level: 200, required: 200, title: "Cyber Analyst", emoji: "💻" },
    { level: 250, required: 250, title: "Matrix Knight", emoji: "⚔️" },
    { level: 300, required: 300, title: "Binary Executioner", emoji: "🔥" },
    { level: 350, required: 350, title: "Quantum Berserker", emoji: "💀" },
    { level: 400, required: 400, title: "Dark Lord of Logic", emoji: "👹" },
    { level: 450, required: 450, title: "Abyssal Emperor", emoji: "🐉" },
    { level: 500, required: 500, title: "Omniscient God of Math", emoji: "👑" }
];

// --- LOGIKA KALKULATOR KONVERSI ---
const inputs = { dec: document.getElementById('dec-input'), bin: document.getElementById('bin-input'), oct: document.getElementById('oct-input'), hex: document.getElementById('hex-input') };
const regex = { dec: /^[0-9]*$/, bin: /^[01]*$/, oct: /^[0-7]*$/, hex: /^[0-9A-Fa-f]*$/ };

function convert(value, fromBase) {
    if (!value) { Object.values(inputs).forEach(input => input.value = ''); return; }
    try {
        let decimalValue;
        if (fromBase === 10) decimalValue = BigInt(value);
        else if (fromBase === 16) decimalValue = BigInt('0x' + value);
        else if (fromBase === 2) decimalValue = BigInt('0b' + value);
        else if (fromBase === 8) decimalValue = BigInt('0o' + value);

        if (fromBase !== 10) inputs.dec.value = decimalValue.toString(10);
        if (fromBase !== 2) inputs.bin.value = decimalValue.toString(2);
        if (fromBase !== 8) inputs.oct.value = decimalValue.toString(8);
        if (fromBase !== 16) inputs.hex.value = decimalValue.toString(16).toUpperCase();
    } catch (e) {}
}

Object.keys(inputs).forEach(key => {
    let base = key === 'dec' ? 10 : key === 'bin' ? 2 : key === 'oct' ? 8 : 16;
    inputs[key].addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!regex[key].test(val)) {
            e.target.classList.add('error');
            setTimeout(() => e.target.classList.remove('error'), 300);
            e.target.value = val.slice(0, -1);
            return;
        }
        convert(val, base);
    });
});

// --- LOGIKA KALKULATOR SAINTIFIK ---
const sciDisplay = document.getElementById('sci-display');
const sciBtns = document.querySelectorAll('.sci-btn');
let sciExpression = "";

sciBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const value = btn.dataset.value;

        if (action === 'clear') { sciExpression = ""; sciDisplay.value = ""; }
        else if (action === 'delete') { sciExpression = sciExpression.slice(0, -1); sciDisplay.value = sciExpression; }
        else if (action === 'calculate') {
            if (!sciExpression) return;
            try {
                let evalExpr = sciExpression
                    .replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**')
                    .replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E')
                    .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(')
                    .replace(/log\(/g, 'Math.log10(').replace(/ln\(/g, 'Math.log(').replace(/√\(/g, 'Math.sqrt(');
                
                let openBrackets = (evalExpr.match(/\(/g) || []).length;
                let closeBrackets = (evalExpr.match(/\)/g) || []).length;
                for(let i = 0; i < (openBrackets - closeBrackets); i++) evalExpr += ')';

                let result = new Function('return ' + evalExpr)();
                result = Math.round(result * 1e10) / 1e10; 
                sciDisplay.value = result;
                sciExpression = result.toString();
            } catch (e) {
                sciDisplay.value = "Error";
                setTimeout(() => sciDisplay.value = sciExpression, 1500);
            }
        } else {
            sciExpression += value;
            sciDisplay.value = sciExpression;
        }
    });
});

// --- LOGIKA MODE LATIHAN MULTI-TIPE ---
let currentQuestion = {};
let isAnswered = false;

const practiceType = document.getElementById('practice-type');
const elQuestionText = document.getElementById('question-text');
const elQuestionNumber = document.getElementById('question-number');
const elAnswerInput = document.getElementById('answer-input');
const elFeedback = document.getElementById('feedback-text');
const btnSubmit = document.getElementById('submit-answer');
const btnNext = document.getElementById('next-question');

const bases = [ { name: 'Desimal', val: 10 }, { name: 'Biner', val: 2 }, { name: 'Oktal', val: 8 }, { name: 'Hexadesimal', val: 16 } ];

function generateQuestion() {
    isAnswered = false;
    elAnswerInput.value = '';
    elFeedback.textContent = '';
    elAnswerInput.disabled = false;
    btnSubmit.style.display = 'block';
    btnNext.style.display = 'none';
    if(document.getElementById('practice-tab').classList.contains('active')) elAnswerInput.focus();

    const type = practiceType.value;
    
    if (type === 'konversi') {
        let from = bases[Math.floor(Math.random() * bases.length)];
        let to = bases[Math.floor(Math.random() * bases.length)];
        while(from.val === to.val) to = bases[Math.floor(Math.random() * bases.length)];

        let randomDec = BigInt(Math.floor(Math.random() * 255) + 1);
        let questionStr = randomDec.toString(from.val);
        if(from.val === 16) questionStr = questionStr.toUpperCase();
        
        let answerStr = randomDec.toString(to.val);
        if(to.val === 16) answerStr = answerStr.toUpperCase();

        currentQuestion = { type: 'konversi', qText: `Konversi ${from.name} ke ${to.name}`, qNum: questionStr, ans: answerStr };
    
    } else if (type === 'aritmatika') {
        const ops = ['+', '-', '×'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a = Math.floor(Math.random() * 20) + 1;
        let b = Math.floor(Math.random() * 20) + 1;
        
        if (op === '-' && b > a) { let temp = a; a = b; b = temp; }
        
        let ans;
        if(op === '+') ans = a + b;
        else if(op === '-') ans = a - b;
        else if(op === '×') ans = a * b;

        currentQuestion = { type: 'aritmatika', qText: "Hitung hasil dari:", qNum: `${a} ${op} ${b}`, ans: ans.toString() };

    } else if (type === 'saintifik') {
        const ops = ['akar', 'pangkat2', 'pangkat3'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let qNum, ans;

        if (op === 'akar') {
            let base = Math.floor(Math.random() * 15) + 1;
            ans = base;
            qNum = `√${base * base}`;
        } else if (op === 'pangkat2') {
            let base = Math.floor(Math.random() * 20) + 1;
            ans = base * base;
            qNum = `${base}²`;
        } else {
            let base = Math.floor(Math.random() * 10) + 1;
            ans = base * base * base;
            qNum = `${base}³`;
        }
        currentQuestion = { type: 'saintifik', qText: "Hitung nilai dari:", qNum: qNum, ans: ans.toString() };
    }

    elQuestionText.textContent = currentQuestion.qText;
    elQuestionNumber.textContent = currentQuestion.qNum;
}

practiceType.addEventListener('change', generateQuestion);

function checkAnswer() {
    if(isAnswered) return;
    let userAns = elAnswerInput.value.trim().toUpperCase();
    if(!userAns) return;

    isAnswered = true;
    elAnswerInput.disabled = true;
    btnSubmit.style.display = 'none';
    btnNext.style.display = 'block';
    btnNext.focus();

    if(userAns === currentQuestion.ans) {
        elFeedback.textContent = "Jawaban Anda Benar! 🎉";
        elFeedback.className = "text-success";
        updateStats(currentQuestion.type, true);
    } else {
        elFeedback.textContent = `Salah. Jawaban yang benar: ${currentQuestion.ans}`;
        elFeedback.className = "text-danger";
        updateStats(currentQuestion.type, false);
    }
}

btnSubmit.addEventListener('click', checkAnswer);
elAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isAnswered) checkAnswer();
    else if (e.key === 'Enter' && isAnswered) generateQuestion();
});
btnNext.addEventListener('click', generateQuestion);

// --- LOGIKA PENYIMPANAN PROFIL, STATISTIK & AVATAR RPG ---
let stats = JSON.parse(localStorage.getItem('calcDataRPG')) || {
    konversi: { correct: 0, wrong: 0 },
    aritmatika: { correct: 0, wrong: 0 },
    saintifik: { correct: 0, wrong: 0 },
    selectedAvatar: "🌱"
};

function getTotalSolved() {
    return stats.konversi.correct + stats.konversi.wrong +
           stats.aritmatika.correct + stats.aritmatika.wrong +
           stats.saintifik.correct + stats.saintifik.wrong;
}

function renderProfileUI() {
    const total = getTotalSolved();
    const cappedTotal = Math.min(total, 500);

    // Cari level tertinggi yang sudah ter-unlock
    let currentUnlockedLevelObj = AVATAR_LEVELS[0];
    for (let item of AVATAR_LEVELS) {
        if (total >= item.required) {
            currentUnlockedLevelObj = item;
        }
    }

    // Jika avatar yang sedang dipilih user belum pernah di-unlock (misal karena reset), kembalikan ke default
    let activeEmoji = stats.selectedAvatar;
    let activeLevelObj = AVATAR_LEVELS.find(a => a.emoji === activeEmoji);
    if (!activeLevelObj || total < activeLevelObj.required) {
        activeEmoji = currentUnlockedLevelObj.emoji;
        stats.selectedAvatar = activeEmoji;
    }

    // Update Header UI
    document.getElementById('current-avatar').textContent = activeEmoji;
    document.getElementById('profile-level-title').textContent = AVATAR_LEVELS.find(a => a.emoji === activeEmoji).title;
    document.getElementById('total-solved').textContent = total;

    // Progress bar ke 500 max level
    let progressPercent = (cappedTotal / 500) * 100;
    document.getElementById('progress-bar').style.width = progressPercent + '%';

    // Render Grid Avatar Shop
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = '';

    AVATAR_LEVELS.forEach(item => {
        let isUnlocked = total >= item.required;
        let isSelected = item.emoji === activeEmoji;

        let card = document.createElement('div');
                card.className = `avatar-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'active-selected' : ''}`;
        
        card.innerHTML = `
            <span class="avatar-emoji">${item.emoji}</span>
            <span class="avatar-lvl">Lv.${item.level}</span>
        `;

        if (isUnlocked) {
            card.addEventListener('click', () => {
                stats.selectedAvatar = item.emoji;
                localStorage.setItem('calcDataRPG', JSON.stringify(stats));
                renderProfileUI();
            });
        }
        grid.appendChild(card);
    });

    // Render Stats Category
    const types = ['konversi', 'aritmatika', 'saintifik'];
    const ids = ['konv', 'arit', 'sci'];

    types.forEach((type, index) => {
        let prefix = ids[index];
        let c = stats[type].correct;
        let w = stats[type].wrong;
        let t = c + w;
        let acc = t === 0 ? 0 : Math.round((c / t) * 100);

        document.getElementById(`${prefix}-benar`).textContent = c;
        document.getElementById(`${prefix}-salah`).textContent = w;
        document.getElementById(`${prefix}-akurasi`).textContent = acc + '%';
    });

    localStorage.setItem('calcDataRPG', JSON.stringify(stats));
}

function updateStats(type, isCorrect) {
    if(isCorrect) stats[type].correct++;
    else stats[type].wrong++;
    
    // Cek apakah baru saja membuka level baru untuk notifikasi kecil (opsional)
    renderProfileUI();
}

document.getElementById('reset-stats').addEventListener('click', () => {
    stats = {
        konversi: { correct: 0, wrong: 0 },
        aritmatika: { correct: 0, wrong: 0 },
        saintifik: { correct: 0, wrong: 0 },
        selectedAvatar: "🌱"
    };
    renderProfileUI();
    
    const btn = document.getElementById('reset-stats');
    const oldText = btn.textContent;
    btn.textContent = "Berhasil Direset!";
    setTimeout(() => btn.textContent = oldText, 2000);
});

// Inisialisasi awal
generateQuestion();
renderProfileUI();
