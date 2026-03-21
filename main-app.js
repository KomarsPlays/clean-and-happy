// ===== ДАННЫЕ: ЗОНЫ =====
const ZONES = {
    kitchen:  { id: 'kitchen',  name: 'Кухня',    color: '#e5c51a', lightColor: '#f7ebb7', icon: '<i class="ph-bold ph-cooking-pot"></i>' },
    room:     { id: 'room',     name: 'Комната',   color: '#d65e9e', lightColor: '#f8c8e0', icon: '<i class="ph-bold ph-bed"></i>' },
    bathroom: { id: 'bathroom', name: 'Ванная',    color: '#67a4db', lightColor: '#c4d8f4', icon: '<i class="ph-bold ph-shower"></i>' },
    hallway:  { id: 'hallway',  name: 'Прихожая',  color: '#a59bcd', lightColor: '#ead1e6', icon: '<i class="ph-bold ph-key"></i>' },
};

// ===== ДАННЫЕ: ЕЖЕДНЕВНЫЕ ЗАДАЧИ =====
const DEFAULT_DAILY_TASKS = {
    morning: [
        { id: 'dm1', text: 'Убрать диван' },
        { id: 'dm2', text: 'Разобрать сушилку для посуды' },
    ],
    evening: [
        { id: 'de1', text: 'Протереть машинку, если была стирка' },
        { id: 'de2', text: 'Помыть посуду и плиту' },
        { id: 'de3', text: 'Выбросить капсулу из кофе-машины' },
    ],
};

// ===== ДАННЫЕ: ПЕРИОДИЧЕСКИЕ ЗАДАЧИ =====
const DEFAULT_PERIODIC_TASKS = [
    // -- Кухня --
    { id: 'p01', name: 'Поменять полотенце на кухне',                         zones: ['kitchen'],  intervalDays: 7,  fixedWeekday: null },
    { id: 'p02', name: 'Прокипятить чайник лимонкой',                          zones: ['kitchen'],  intervalDays: 7,  fixedWeekday: null },
    { id: 'p03', name: 'Помыть с фейри экран "coffee...", часть хол-ка у плиты', zones: ['kitchen'],  intervalDays: 7,  fixedWeekday: null },
    { id: 'p04', name: 'Протереть с уксусом кухонный фартук',                 zones: ['kitchen'],  intervalDays: 14, fixedWeekday: null },
    { id: 'p05', name: 'Постирать кухонную микрофибру',                        zones: ['kitchen'],  intervalDays: 10, fixedWeekday: null },
    // -- Все зоны --
    { id: 'p06', name: 'Пропылесосить квартиру',                              zones: ['kitchen','room','bathroom','hallway'], intervalDays: 7,  fixedWeekday: 6 },
    { id: 'p07', name: 'Пропылесосить внутри дивана и диван',                  zones: ['room'],     intervalDays: 14, fixedWeekday: 6 },
    { id: 'p08', name: 'Помыть полы',                                          zones: ['kitchen','room','bathroom','hallway'], intervalDays: 7,  fixedWeekday: 6 },
    // -- Ванная --
    { id: 'p09', name: 'Обеспылить этажерку, машинку, бочок унитаза + уксус',  zones: ['bathroom'], intervalDays: 4,  fixedWeekday: null },
    { id: 'p10', name: 'Помыть ванну санэлитом',                               zones: ['bathroom'], intervalDays: 7,  fixedWeekday: null },
    { id: 'p11', name: 'Помыть стены возле ванной санэлитом',                   zones: ['bathroom'], intervalDays: 14, fixedWeekday: null },
    { id: 'p12', name: 'Помыть шторку',                                        zones: ['bathroom'], intervalDays: 14, fixedWeekday: null },
    { id: 'p13', name: 'Залить унитаз санэлитом + ершик',                      zones: ['bathroom'], intervalDays: 3,  fixedWeekday: null },
    { id: 'p14', name: 'Помыть раковину',                                      zones: ['bathroom'], intervalDays: 3,  fixedWeekday: null },
    { id: 'p15', name: 'Протереть сидушку унитаза спирт. салфеткой',           zones: ['bathroom'], intervalDays: 2,  fixedWeekday: null },
    { id: 'p16', name: 'Постирать коврик',                                     zones: ['bathroom'], intervalDays: 14, fixedWeekday: 6 },
    { id: 'p17', name: 'Протереть зеркало и полочку',                          zones: ['bathroom'], intervalDays: 7,  fixedWeekday: null },
    { id: 'p18', name: 'Постирать полотенца, повесить другие',                 zones: ['bathroom'], intervalDays: 14, fixedWeekday: null },
    // -- Комната --
    { id: 'p19', name: 'Поменять постельное белье + постирать',                zones: ['room'],     intervalDays: 14, fixedWeekday: null },
    { id: 'p20', name: 'Обеспыливание: Сашин стол',                            zones: ['room'],     intervalDays: 14, fixedWeekday: null },
    { id: 'p21', name: 'Обеспыливание: маленькая этажерка',                     zones: ['room'],     intervalDays: 14, fixedWeekday: null },
    { id: 'p22', name: 'Обеспыливание: большая этажерка',                       zones: ['room'],     intervalDays: 14, fixedWeekday: null },
    { id: 'p23', name: 'Обеспыливание: холодильник и всё на нём',               zones: ['room'],     intervalDays: 14, fixedWeekday: null },
    { id: 'p24', name: 'Обеспыливание: подоконник',                             zones: ['room'],     intervalDays: 14, fixedWeekday: null },
];

// ===== СОСТОЯНИЕ ПРИЛОЖЕНИЯ =====
let state = {
    dailyTasks: { morning: [], evening: [] },
    periodicTasks: [],
    todayLog: { daily: {}, periodic: {} }, // {taskId: completedTimestamp}
};

// ===== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ =====
const STORAGE_KEYS = {
    daily: 'ch_daily_tasks',
    periodic: 'ch_periodic_tasks',
    log: 'ch_today_log',
    logDate: 'ch_log_date',
};

function saveToLocal() {
    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(state.dailyTasks));
    localStorage.setItem(STORAGE_KEYS.periodic, JSON.stringify(state.periodicTasks));
    localStorage.setItem(STORAGE_KEYS.log, JSON.stringify(state.todayLog));
    localStorage.setItem(STORAGE_KEYS.logDate, todayStr());
}

function loadFromLocal() {
    const savedDate = localStorage.getItem(STORAGE_KEYS.logDate);
    const today = todayStr();

    // Ежедневные задачи
    const savedDaily = localStorage.getItem(STORAGE_KEYS.daily);
    if (savedDaily) {
        state.dailyTasks = JSON.parse(savedDaily);
    } else {
        state.dailyTasks = JSON.parse(JSON.stringify(DEFAULT_DAILY_TASKS));
    }

    // Периодические задачи
    const savedPeriodic = localStorage.getItem(STORAGE_KEYS.periodic);
    if (savedPeriodic) {
        state.periodicTasks = JSON.parse(savedPeriodic);
    } else {
        state.periodicTasks = initializePeriodicTasks();
    }

    // Лог на сегодня
    if (savedDate === today) {
        const savedLog = localStorage.getItem(STORAGE_KEYS.log);
        if (savedLog) {
            state.todayLog = JSON.parse(savedLog);
            // Migrate: if old format (plain numbers), reset periodic log
            const periodicKeys = Object.keys(state.todayLog.periodic);
            if (periodicKeys.length > 0 && typeof state.todayLog.periodic[periodicKeys[0]] === 'number') {
                state.todayLog.periodic = {};
            }
        }
    } else {
        // Новый день — сбрасываем ежедневные галочки
        state.todayLog = { daily: {}, periodic: {} };
    }

    // Состояние звука
    state.soundEnabled = localStorage.getItem('ch_sound') !== 'false';

    // Подгружаем статистику истории
    state.historyStat = JSON.parse(localStorage.getItem('ch_history_stat') || '{}');
}

// ===== FIREBASE SYNC =====
let unsubscribers = [];

function initFirebaseSync() {
    if (!useFirebase || !db) return;

    // Подписка на конфигурацию
    const unsub1 = db.collection('clean-happy').doc('config')
        .onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.dailyTasks) state.dailyTasks = data.dailyTasks;
                if (data.periodicTasks) state.periodicTasks = data.periodicTasks;
                renderAll();
            }
        });

    // Подписка на лог сегодня
    const unsub2 = db.collection('clean-happy').doc('log-' + todayStr())
        .onSnapshot(doc => {
            if (doc.exists) {
                state.todayLog = doc.data();
                renderAll();
            }
        });

    unsubscribers.push(unsub1, unsub2);
}

function saveToFirebase() {
    if (!useFirebase || !db) return;

    db.collection('clean-happy').doc('config').set({
        dailyTasks: state.dailyTasks,
        periodicTasks: state.periodicTasks,
    }, { merge: true });

    db.collection('clean-happy').doc('log-' + todayStr()).set(
        state.todayLog,
        { merge: true }
    );
}

function save() {
    saveToLocal();
    saveToFirebase();
}

// ===== УТИЛИТЫ =====
function todayStr() {
    return new Date().toISOString().split('T')[0];
}

function todayDate() {
    return new Date();
}

function formatDate(date) {
    const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return {
        day: days[date.getDay()],
        full: `${date.getDate()} ${months[date.getMonth()]}`,
    };
}

function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// ===== ИНИЦИАЛИЗАЦИЯ ПЕРИОДИЧЕСКИХ ЗАДАЧ =====
function initializePeriodicTasks() {
    const today = todayDate();
    const tasks = JSON.parse(JSON.stringify(DEFAULT_PERIODIC_TASKS));

    // Стартовое распределение
    const schedule = {
        1: ['p13', 'p14', 'p15'], // Понедельник
        2: ['p01', 'p02', 'p09'], // Вторник
        3: ['p03', 'p17', 'p20', 'p21'], // Среда
        4: ['p10', 'p22', 'p23', 'p05'], // Четверг
        5: ['p04', 'p11', 'p12', 'p24'], // Пятница
        6: ['p06', 'p08', 'p07', 'p16'], // Суббота
        0: ['p19', 'p18'], // Воскресенье
    };

    // Найти ближайший день недели для каждой задачи
    tasks.forEach(task => {
        let assignedDay = null;

        // Найти в расписании
        for (const [day, ids] of Object.entries(schedule)) {
            if (ids.includes(task.id)) {
                assignedDay = parseInt(day);
                break;
            }
        }

        if (assignedDay !== null) {
            // Рассчитать nextDueAt — ближайший такой день недели
            const todayDow = today.getDay();
            let daysUntil = (assignedDay - todayDow + 7) % 7;
            if (daysUntil === 0) daysUntil = 0; // Если сегодня — показать сегодня

            const nextDate = new Date(today);
            nextDate.setDate(nextDate.getDate() + daysUntil);
            task.nextDueAt = nextDate.toISOString().split('T')[0];
        } else {
            // Показать сразу
            task.nextDueAt = todayStr();
        }

        task.lastCompletedAt = null;
    });

    return tasks;
}

// ===== ЗАДАЧИ НА СЕГОДНЯ =====
function getPeriodicTasksForToday() {
    const today = todayStr();
    return state.periodicTasks.filter(t => {
        const isDue = t.nextDueAt <= today;
        const isDoneToday = !!state.todayLog.periodic[t.id];
        return isDue || isDoneToday;
    });
}

// ===== РЕНДЕР: ДАТА =====
function renderDate() {
    const { day, full } = formatDate(todayDate());
    const dayEl = document.getElementById('dateDay');
    if (dayEl) dayEl.textContent = `| ${day}`;
    
    const fullEl = document.getElementById('dateFull');
    if (fullEl) fullEl.textContent = full;
}

// ===== РЕНДЕР: ПРОГРЕСС =====
function renderProgress() {
    const today = todayStr();
    const totalDaily = state.dailyTasks.morning.length + state.dailyTasks.evening.length;
    const todayPeriodic = getPeriodicTasksForToday();
    // Exclude overdue from progress ring
    const todayOnly = todayPeriodic.filter(t => {
        const logEntry = state.todayLog.periodic[t.id];
        if (logEntry && logEntry.wasOverdue) return false;
        if (!logEntry && t.nextDueAt < today) return false;
        return true;
    });
    const total = totalDaily + todayOnly.length;

    const allDaily = [...state.dailyTasks.morning, ...state.dailyTasks.evening];
    const doneDaily = allDaily.filter(t => !!state.todayLog.daily[t.id]).length;
    
    const donePeriodic = todayOnly.filter(t => !!state.todayLog.periodic[t.id]).length;
    const done = doneDaily + donePeriodic;

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    // Кольцо
    const circle = document.getElementById('progressRing');
    const circumference = 2 * Math.PI * 42; // r=42 (обновленный размер)
    const offset = circumference - (pct / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;

    // Внедрение «Растущего дерева» (Вариант 2 - Улучшенный)
    const textEl = document.getElementById('progressText');
    if (pct === 0) {
        textEl.textContent = '🌱'; // Росток
    } else if (pct < 45) {
        textEl.textContent = '🌿'; // Кустик
    } else if (pct < 100) {
        textEl.textContent = '🌳'; // Дерево
    } else {
        textEl.textContent = '🌸'; // Сакура / Цветение!
    }

    // --- ЭФФЕКТ: САЛЮТ САКУРЫ НА 100% ---
    if (pct === 100) {
        if (!window.sakuraTriggered) {
            window.sakuraTriggered = true;
            triggerSakura();
        }
    } else {
        window.sakuraTriggered = false; // Сброс для следующего раза
    }

    const label = document.getElementById('progressLabel');
    if (label) {
        label.textContent = `${done} из ${total} задач`;
    }

    const mood = document.getElementById('catMood');
    if (mood) {
        if (pct === 0) mood.textContent = '😺';
        else if (pct < 30) mood.textContent = '😸';
        else if (pct < 60) mood.textContent = '😻';
        else if (pct < 100) mood.textContent = '🎉';
        else mood.textContent = '🏆';
    }
}

// ===== РЕНДЕР: ЕЖЕДНЕВНЫЕ ЗАДАЧИ =====
function renderDailyTasks() {
    renderTaskList('morningTasks', state.dailyTasks.morning, 'morning');
    renderTaskList('eveningTasks', state.dailyTasks.evening, 'evening');
}

function renderTaskList(containerId, tasks, period) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (tasks.length === 0) {
        container.innerHTML = '<li class="empty-state"><div class="empty-state-emoji">🐱</div>Нет задач</li>';
        return;
    }

    tasks.forEach(task => {
        const isCompleted = !!state.todayLog.daily[task.id];
        const li = document.createElement('li');
        li.className = 'task-item' + (isCompleted ? ' completed' : '');
        li.innerHTML = `
            <div class="task-checkbox ${isCompleted ? 'checked' : ''}" data-id="${task.id}" data-type="daily"></div>
            <span class="task-text">${task.text}</span>
        `;
        // Клик: точечное переключение класса без перестройки DOM
        li.addEventListener('click', () => {
            toggleDailyTask(task.id, li);
        });
        container.appendChild(li);
    });
}


function renderZoneTiles() {
    const grid = document.getElementById('zoneGrid');
    grid.innerHTML = '';

    const tasks = getPeriodicTasksForToday();
    const today = todayStr();

    if (tasks.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1"><div class="empty-state-emoji">\u2728</div>\u0412\u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u044b \u0438\u043b\u0438 \u043d\u0435\u0442 \u0437\u0430\u0434\u0430\u0447 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f!</div>';
        return;
    }

    tasks.forEach(task => {
        const isCompleted = !!state.todayLog.periodic[task.id];
        // Просрочена: nextDueAt строго раньше сегодня И не выполнена
        const isOverdue = !isCompleted && task.nextDueAt < today;
        // Выполненная overdue — полностью скрываем
        const logEntry = state.todayLog.periodic[task.id];
        if (isCompleted && logEntry && logEntry.wasOverdue) return;

        const tile = document.createElement('div');

        // Определяем класс зоны
        let zoneClass = '';
        if (task.zones.length === 1) {
            zoneClass = 'zone-' + task.zones[0];
        } else {
            zoneClass = 'zone-multi';
            const gradientColors = task.zones.map(z => ZONES[z]?.color || '#CCC');
            
            if (!isCompleted && !isOverdue) {
                tile.style.background = gradientColors[0];
            }
            tile.style.borderColor = gradientColors[0];
        }

        tile.className = `zone-tile ${zoneClass} ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;

        // Просрочена — коралловая заливка
        if (isOverdue) {
            tile.style.background = '#ef726c';
            tile.style.borderColor = '#ef726c';
        }

        const icons = task.zones.map(z => ZONES[z]?.icon || '').join(' ');

        // Бейдж просрочки
        const overdueBadge = isOverdue
            ? '<div class="overdue-badge">!</div>'
            : '';

        tile.innerHTML = `
            <div class="zone-tile-icon">${icons}</div>
            <div class="zone-tile-name">${task.name}</div>
            <div class="zone-tile-badge">\u043a\u0430\u0436\u0434\u044b\u0435 ${task.intervalDays} \u0434\u043d.</div>
            <div class="zone-checkmark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            ${overdueBadge}
        `;

        // Long-press for postpone popup, click for toggle
        let pressTimer = null;
        let isLongPress = false;

        const startPress = (e) => {
            isLongPress = false;
            pressTimer = setTimeout(() => {
                isLongPress = true;
                showPostponePopup(task, tile);
            }, 700);
        };

        const endPress = (e) => {
            clearTimeout(pressTimer);
            if (!isLongPress) {
                togglePeriodicTask(task.id, tile);
            }
        };

        const cancelPress = () => { clearTimeout(pressTimer); };

        tile.addEventListener('mousedown', startPress);
        tile.addEventListener('mouseup', endPress);
        tile.addEventListener('mouseleave', cancelPress);
        tile.addEventListener('touchstart', startPress, { passive: true });
        tile.addEventListener('touchend', (e) => { e.preventDefault(); endPress(e); });
        tile.addEventListener('touchmove', cancelPress);

        grid.appendChild(tile);
    });
}

// ===== POPUP "POSTPONE" =====
function showPostponePopup(task, tile) {
    const existing = document.querySelector('.postpone-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'postpone-overlay';

    const popup = document.createElement('div');
    popup.className = 'postpone-popup';
    popup.innerHTML = `
        <div class="postpone-title">${task.name}</div>
        <div class="postpone-form">
            <span class="postpone-label">\u041f\u0435\u0440\u0435\u0434\u0432\u0438\u043d\u0443\u0442\u044c \u043d\u0430</span>
            <input type="number" class="postpone-input" value="3" min="1" max="365">
            <span class="postpone-label">\u0434\u043d.</span>
        </div>
        <button class="postpone-submit">\u0413\u043e\u0442\u043e\u0432\u043e</button>
    `;

    const input = popup.querySelector('.postpone-input');
    const submitBtn = popup.querySelector('.postpone-submit');

    const doPostpone = () => {
        const days = parseInt(input.value, 10);
        if (days && days > 0) {
            postponeTask(task.id, days);
            overlay.remove();
        }
    };

    submitBtn.addEventListener('click', (e) => { e.stopPropagation(); doPostpone(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doPostpone(); });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    input.focus();
    input.select();
}

function postponeTask(taskId, days) {
    const task = state.periodicTasks.find(t => t.id === taskId);
    if (!task) return;

    saveSnapshot(`\u041f\u0435\u0440\u0435\u0434\u0432\u0438\u043d\u0443\u0442\u043e: ${task.name}`);

    const next = new Date();
    next.setDate(next.getDate() + days);
    task.nextDueAt = next.toISOString().split('T')[0];

    save();
    updateTodayStat();
    renderAll();
    showUndoToast(`${task.name} \u2192 +${days} \u0434\u043d.`);
}

// ===== UNDO =====
let undoSnapshot = null;
let undoTimer = null;

function saveSnapshot(label) {
    undoSnapshot = {
        label,
        periodicTasks: JSON.parse(JSON.stringify(state.periodicTasks)),
        todayLog: JSON.parse(JSON.stringify(state.todayLog)),
        historyStat: state.historyStat ? JSON.parse(JSON.stringify(state.historyStat)) : {}
    };
}

function performUndo() {
    if (!undoSnapshot) return;
    state.periodicTasks = undoSnapshot.periodicTasks;
    state.todayLog = undoSnapshot.todayLog;
    state.historyStat = undoSnapshot.historyStat;
    undoSnapshot = null;
    save();
    updateTodayStat();
    renderAll();
    hideUndoToast();
}

function showUndoToast(text) {
    hideUndoToast();
    const toast = document.createElement('div');
    toast.className = 'undo-toast';
    toast.id = 'undoToast';
    toast.innerHTML = `<span>${text}</span><button onclick="performUndo()">\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c</button>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    undoTimer = setTimeout(() => hideUndoToast(), 5000);
}

function hideUndoToast() {
    clearTimeout(undoTimer);
    const toast = document.getElementById('undoToast');
    if (toast) {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    }
}

// ===== КНОПКА "СДЕЛАЛА ЕЩЁ" =====
function initExtraDone() {
    const btn = document.getElementById('btnExtraDone');
    const list = document.getElementById('extraDoneList');
    if (!btn || !list) return;

    btn.addEventListener('click', () => {
        const isOpen = list.classList.contains('open');
        if (isOpen) {
            list.classList.remove('open');
            btn.classList.remove('active');
        } else {
            renderExtraDoneList();
            list.classList.add('open');
            btn.classList.add('active');
        }
    });
}

function renderExtraDoneList() {
    const list = document.getElementById('extraDoneList');
    list.innerHTML = '';

    const today = todayStr();
    // Показываем задачи, которые НЕ назначены на сегодня и НЕ выполнены сегодня
    const extraTasks = state.periodicTasks.filter(t => {
        const isDueToday = t.nextDueAt <= today;
        const isDoneToday = !!state.todayLog.periodic[t.id];
        return !isDueToday && !isDoneToday;
    });

    if (extraTasks.length === 0) {
        list.innerHTML = '<div class="extra-done-empty">\u0412\u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0443\u0436\u0435 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f!</div>';
        return;
    }

    extraTasks.forEach(task => {
        const zoneColor = task.zones.length === 1
            ? (ZONES[task.zones[0]]?.color || '#ccc')
            : '#F4A97A';
        const zoneName = task.zones.map(z => ZONES[z]?.name || z).join(', ');

        const item = document.createElement('div');
        item.className = 'extra-done-item';
        item.innerHTML = `
            <span class="extra-done-dot" style="background: ${zoneColor}"></span>
            <span class="extra-done-name">${task.name}</span>
            <span class="extra-done-zone">${zoneName}</span>
        `;

        item.addEventListener('click', () => {
            completeExtraTask(task.id);
        });

        list.appendChild(item);
    });
}

function completeExtraTask(taskId) {
    const task = state.periodicTasks.find(t => t.id === taskId);
    if (!task) return;

    saveSnapshot('extra-done');

    // Mark as done today (not overdue — this is voluntary)
    state.todayLog.periodic[taskId] = { time: Date.now(), wasOverdue: false };

    // Shift nextDueAt forward from today
    task.lastCompletedAt = todayStr();
    const next = new Date();
    next.setDate(next.getDate() + task.intervalDays);
    task.nextDueAt = next.toISOString().split('T')[0];

    save();
    updateTodayStat();
    renderAll();

    // Close the list
    const list = document.getElementById('extraDoneList');
    const btn = document.getElementById('btnExtraDone');
    if (list) list.classList.remove('open');
    if (btn) btn.classList.remove('active');

    // Celebrate!
    setTimeout(() => spawnConfetti(), 100);
    triggerCatReaction();
    SoundController.playMeow();
    updateCatThoughts();
}

// ===== ДЕЙСТВИЯ =====
function updateTodayStat() {
    if (!state.historyStat) state.historyStat = {};
    const today = todayStr();
    
    const totalDaily = state.dailyTasks.morning.length + state.dailyTasks.evening.length;
    const todayPeriodic = getPeriodicTasksForToday();
    // Exclude overdue: only count tasks due today (not past-due)
    const todayOnly = todayPeriodic.filter(t => {
        const logEntry = state.todayLog.periodic[t.id];
        if (logEntry && logEntry.wasOverdue) return false; // completed overdue — skip
        if (!logEntry && t.nextDueAt < today) return false; // uncompleted overdue — skip
        return true;
    });
    const total = totalDaily + todayOnly.length;

    const allDaily = [...state.dailyTasks.morning, ...state.dailyTasks.evening];
    const doneDaily = allDaily.filter(t => !!state.todayLog.daily[t.id]).length;
    
    const donePeriodic = todayOnly.filter(t => !!state.todayLog.periodic[t.id]).length;
    const done = doneDaily + donePeriodic;

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    state.historyStat[today] = pct;

    // Сохраняем статистику локально
    localStorage.setItem('ch_history_stat', JSON.stringify(state.historyStat));
}
function toggleDailyTask(taskId, element) {
    saveSnapshot('daily-toggle');
    if (state.todayLog.daily[taskId]) {
        delete state.todayLog.daily[taskId];
        // Точечное снятие класса
        if (element) {
            element.classList.remove('completed');
            const cb = element.querySelector('.task-checkbox');
            if (cb) cb.classList.remove('checked');
        }
    } else {
        state.todayLog.daily[taskId] = Date.now();
        // Точечное добавление класса
        if (element) {
            element.classList.add('completed');
            const cb = element.querySelector('.task-checkbox');
            if (cb) cb.classList.add('checked');
        }
        setTimeout(() => spawnConfetti(), 100);
        if (navigator.vibrate) navigator.vibrate(50);
        triggerCatReaction();
        SoundController.playPop();
        updateCatThoughts();
    }
    updateTodayStat();
    save();
    renderProgress(); // Обновляем только колечко, без перестройки DOM
}

function togglePeriodicTask(taskId, element) {
    const task = state.periodicTasks.find(t => t.id === taskId);
    const today = todayStr();
    const wasOverdue = task && task.nextDueAt < today;

    saveSnapshot('periodic-toggle');

    if (state.todayLog.periodic[taskId]) {
        // Отмена выполнения
        delete state.todayLog.periodic[taskId];
        if (task) {
            task.nextDueAt = todayStr();
            task.lastCompletedAt = null;
        }
        // Overdue: need full re-render to show tile again
        if (wasOverdue) {
            save();
            updateTodayStat();
            renderAll();
            return;
        }
        if (element) element.classList.remove('completed');
    } else {
        // Выполнено!
        state.todayLog.periodic[taskId] = { time: Date.now(), wasOverdue: wasOverdue };
        if (task) {
            task.lastCompletedAt = todayStr();
            const next = new Date();
            next.setDate(next.getDate() + task.intervalDays);
            task.nextDueAt = next.toISOString().split('T')[0];
        }
        // Overdue: full re-render to hide tile
        if (wasOverdue) {
            setTimeout(() => spawnConfetti(), 100);
            if (navigator.vibrate) navigator.vibrate(50);
            triggerCatReaction();
            SoundController.playMeow();
            updateCatThoughts();
            save();
            updateTodayStat();
            renderAll();
            return;
        }
        if (element) element.classList.add('completed');
        setTimeout(() => spawnConfetti(), 100);
        if (navigator.vibrate) navigator.vibrate(50);
        triggerCatReaction();
        SoundController.playMeow();
        updateCatThoughts();
    }
    updateTodayStat();
    save();
    renderProgress();
}

// ===== КОНФЕТТИ =====
function spawnConfetti() {
    const container = document.getElementById('confetti-container');
    const isBlueberry = document.body.classList.contains('theme-blueberry');

    if (isBlueberry) {
        // Ночные розовые лепестки
        const petals = ['🌸', '💮', '✿', '❀'];
        for (let i = 0; i < 6; i++) {
            const petal = document.createElement('div');
            petal.className = 'confetti-piece';
            petal.textContent = petals[Math.floor(Math.random() * petals.length)];
            petal.style.left = Math.random() * 100 + '%';
            petal.style.top = Math.random() * 30 + '%';
            petal.style.backgroundColor = 'transparent';
            petal.style.fontSize = (10 + Math.random() * 8) + 'px';
            petal.style.width = 'auto';
            petal.style.height = 'auto';
            petal.style.opacity = '0.7';
            petal.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
            petal.style.animationDelay = Math.random() * 0.3 + 's';
            container.appendChild(petal);
            setTimeout(() => petal.remove(), 3000);
        }
    } else {
        // Дневные конфетти — золотые искры + подсолнухи
        const sunEmojis = ['✨', '🌻', '⭐', '💛', '☀️'];
        const goldColors = ['#F4B17A', '#E5C51A', '#FFD700', '#F0C060', '#FFDAB9', '#FFC857'];
        for (let i = 0; i < 8; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.top = Math.random() * 30 + '%';

            if (Math.random() > 0.5) {
                // Эмодзи-искорки
                piece.textContent = sunEmojis[Math.floor(Math.random() * sunEmojis.length)];
                piece.style.backgroundColor = 'transparent';
                piece.style.fontSize = (10 + Math.random() * 8) + 'px';
                piece.style.width = 'auto';
                piece.style.height = 'auto';
            } else {
                // Золотые конфетти
                piece.style.backgroundColor = goldColors[Math.floor(Math.random() * goldColors.length)];
                piece.style.width = (4 + Math.random() * 8) + 'px';
                piece.style.height = (4 + Math.random() * 8) + 'px';
            }
            piece.style.animationDuration = (1 + Math.random() * 1.5) + 's';
            piece.style.animationDelay = Math.random() * 0.3 + 's';
            container.appendChild(piece);
            setTimeout(() => piece.remove(), 2500);
        }
    }
}

// ===== НАСТРОЙКИ: МОДАЛЬНОЕ ОКНО =====
function initSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const btnOpen = document.getElementById('btnSettings');
    const btnClose = document.getElementById('btnCloseSettings');

    btnOpen.addEventListener('click', () => {
        modal.classList.add('open');
        renderSettingsContent();
        loadFirebaseSettingsToUI(); // Подгружаем ключи в поля ввода
    });

    btnClose.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    // Табы (только внутри модалки настроек)
    modal.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
            modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab' + capitalize(btn.dataset.tab)).classList.add('active');
        });
    });

    // Добавление ежедневных задач
    document.getElementById('btnAddMorning').addEventListener('click', () => addDailyTask('morning'));
    document.getElementById('btnAddEvening').addEventListener('click', () => addDailyTask('evening'));
    document.getElementById('inputMorningTask').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addDailyTask('morning');
    });
    document.getElementById('inputEveningTask').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addDailyTask('evening');
    });

    // Добавление периодической задачи
    document.getElementById('btnAddPeriodic').addEventListener('click', addPeriodicTask);

    // Зоны — чекбоксы
    renderZoneCheckboxes();

    // Сохранение настроек Firebase
    const btnSaveFB = document.getElementById('btnSaveFirebase');
    if (btnSaveFB) {
        btnSaveFB.addEventListener('click', saveFirebaseSettings);
    }
}

// ===== НАСТРОЙКИ: FIREBASE =====
function loadFirebaseSettingsToUI() {
    const saved = localStorage.getItem('ch_firebase_config');
    const statusEl = document.getElementById('fbStatus');
    
    if (saved) {
        const config = JSON.parse(saved);
        document.getElementById('fbApiKey').value = config.apiKey || '';
        document.getElementById('fbAuthDomain').value = config.authDomain || '';
        document.getElementById('fbProjectId').value = config.projectId || '';
        document.getElementById('fbStorageBucket').value = config.storageBucket || '';
        document.getElementById('fbSenderId').value = config.messagingSenderId || '';
        document.getElementById('fbAppId').value = config.appId || '';
    }
    
    if (useFirebase) {
        statusEl.innerHTML = '<span style="color: #10B981;">🟢 Подключено к Firebase</span>';
    } else {
        statusEl.innerHTML = '<span style="color: #F59E0B;">🟠 Ключи не сохранены или пустые (Firebase выключен)</span>';
    }
}

function saveFirebaseSettings() {
    const config = {
        apiKey: document.getElementById('fbApiKey').value.trim(),
        authDomain: document.getElementById('fbAuthDomain').value.trim(),
        projectId: document.getElementById('fbProjectId').value.trim(),
        storageBucket: document.getElementById('fbStorageBucket').value.trim(),
        messagingSenderId: document.getElementById('fbSenderId').value.trim(),
        appId: document.getElementById('fbAppId').value.trim()
    };
    
    if (!config.apiKey || config.apiKey.includes('Key') || config.apiKey === 'YOUR_API_KEY') {
        alert('Пожалуйста, введите корректный API Key');
        return;
    }
    
    localStorage.setItem('ch_firebase_config', JSON.stringify(config));
    
    const statusEl = document.getElementById('fbStatus');
    statusEl.innerHTML = '<span style="color: #3B82F6;">💾 Настройки сохранены! Перезагрузка для активации...</span>';
    
    setTimeout(() => {
        window.location.reload();
    }, 1200);
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderZoneCheckboxes() {
    const container = document.getElementById('zoneCheckboxes');
    container.innerHTML = '';
    Object.values(ZONES).forEach(zone => {
        const label = document.createElement('label');
        label.className = 'zone-checkbox-label';
        label.innerHTML = `
            <input type="checkbox" value="${zone.id}">
            <span class="zone-badge" style="background:${zone.color}"></span>
            ${zone.name}
        `;
        container.appendChild(label);
    });
}

function renderSettingsContent() {
    // Ежедневные — утро
    renderSettingsTaskList('settingsMorning', state.dailyTasks.morning, 'morning');
    // Ежедневные — вечер
    renderSettingsTaskList('settingsEvening', state.dailyTasks.evening, 'evening');
    // Периодические
    renderSettingsPeriodicList();
}

function renderSettingsTaskList(containerId, tasks, period) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'settings-task-item';
        li.innerHTML = `
            <span class="task-name" title="\u041d\u0430\u0436\u043c\u0438, \u0447\u0442\u043e\u0431\u044b \u043f\u0435\u0440\u0435\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u0442\u044c">${task.text}</span>
            <button class="btn-delete-task" data-id="${task.id}" data-period="${period}" aria-label="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;

        // Inline-edit name
        const nameEl = li.querySelector('.task-name');
        nameEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (nameEl.querySelector('input')) return;
            const currentText = task.text;
            nameEl.innerHTML = `<input type="text" class="name-input" value="${currentText.replace(/"/g, '&quot;')}">`;
            const input = nameEl.querySelector('input');
            input.focus();
            input.select();

            const applyChange = () => {
                const newText = input.value.trim();
                if (newText && newText !== currentText) {
                    task.text = newText;
                    save();
                    renderAll();
                }
                renderSettingsContent();
            };
            input.addEventListener('blur', applyChange);
            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
                if (ev.key === 'Escape') { renderSettingsContent(); }
            });
        });

        li.querySelector('.btn-delete-task').addEventListener('click', () => {
            deleteDailyTask(period, task.id);
        });
        container.appendChild(li);
    });
}

function renderSettingsPeriodicList() {
    const container = document.getElementById('settingsPeriodic');
    container.innerHTML = '';

    state.periodicTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'settings-task-item';

        const zoneBadges = task.zones.map(z => {
            const zone = ZONES[z];
            return zone ? `<span class="zone-badge" style="background:${zone.color}" title="${zone.name}"></span>` : '';
        }).join('');

        const weekdays = ['\u0412\u0441', '\u041f\u043d', '\u0412\u0442', '\u0421\u0440', '\u0427\u0442', '\u041f\u0442', '\u0421\u0431'];
        const fixedDay = task.fixedWeekday !== null ? ` (${weekdays[task.fixedWeekday]})` : '';

        li.innerHTML = `
            <div class="task-zones-badges">${zoneBadges}</div>
            <span class="task-name" title="\u041d\u0430\u0436\u043c\u0438, \u0447\u0442\u043e\u0431\u044b \u043f\u0435\u0440\u0435\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u0442\u044c">${task.name}</span>
            <span class="task-interval" data-task-id="${task.id}" title="\u041d\u0430\u0436\u043c\u0438, \u0447\u0442\u043e\u0431\u044b \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c">${task.intervalDays} \u0434\u043d.${fixedDay}</span>
            <button class="btn-delete-task" data-id="${task.id}" aria-label="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;

        // Inline-edit name
        const nameEl = li.querySelector('.task-name');
        nameEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (nameEl.querySelector('input')) return;
            const currentName = task.name;
            nameEl.innerHTML = `<input type="text" class="name-input" value="${currentName.replace(/"/g, '&quot;')}">`;
            const input = nameEl.querySelector('input');
            input.focus();
            input.select();

            const applyChange = () => {
                const newName = input.value.trim();
                if (newName && newName !== currentName) {
                    task.name = newName;
                    save();
                    renderAll();
                }
                renderSettingsPeriodicList();
            };
            input.addEventListener('blur', applyChange);
            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
                if (ev.key === 'Escape') { renderSettingsPeriodicList(); }
            });
        });

        // Inline-edit interval
        const intervalEl = li.querySelector('.task-interval');
        intervalEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (intervalEl.querySelector('input')) return; // Already editing

            const currentVal = task.intervalDays;
            intervalEl.innerHTML = `<input type="number" class="interval-input" value="${currentVal}" min="1" max="365">`;
            const input = intervalEl.querySelector('input');
            input.focus();
            input.select();

            const applyChange = () => {
                const newVal = parseInt(input.value, 10);
                if (newVal && newVal > 0 && newVal !== currentVal) {
                    task.intervalDays = newVal;
                    // Recalculate nextDueAt from lastCompletedAt
                    if (task.lastCompletedAt) {
                        const last = new Date(task.lastCompletedAt);
                        last.setDate(last.getDate() + newVal);
                        task.nextDueAt = last.toISOString().split('T')[0];
                    }
                    save();
                    renderAll();
                }
                renderSettingsPeriodicList();
            };

            input.addEventListener('blur', applyChange);
            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
                if (ev.key === 'Escape') { renderSettingsPeriodicList(); }
            });
        });

        li.querySelector('.btn-delete-task').addEventListener('click', () => {
            deletePeriodicTask(task.id);
        });
        container.appendChild(li);
    });
}

// ===== ДЕЙСТВИЯ С НАСТРОЙКАМИ =====
function addDailyTask(period) {
    const inputId = period === 'morning' ? 'inputMorningTask' : 'inputEveningTask';
    const input = document.getElementById(inputId);
    const text = input.value.trim();
    if (!text) return;

    state.dailyTasks[period].push({
        id: generateId(),
        text: text,
    });

    input.value = '';
    save();
    renderSettingsContent();
    renderAll();
}

function deleteDailyTask(period, taskId) {
    state.dailyTasks[period] = state.dailyTasks[period].filter(t => t.id !== taskId);
    delete state.todayLog.daily[taskId];
    save();
    renderSettingsContent();
    renderAll();
}

function addPeriodicTask() {
    const name = document.getElementById('inputPeriodicName').value.trim();
    if (!name) return;

    const interval = parseInt(document.getElementById('inputInterval').value) || 7;
    const weekdaySelect = document.getElementById('inputWeekday').value;
    const fixedWeekday = weekdaySelect ? parseInt(weekdaySelect) : null;

    const zoneChecks = document.querySelectorAll('#zoneCheckboxes input[type="checkbox"]:checked');
    const zones = Array.from(zoneChecks).map(c => c.value);
    if (zones.length === 0) {
        // Default to kitchen if nothing selected
        zones.push('kitchen');
    }

    const newTask = {
        id: generateId(),
        name: name,
        zones: zones,
        intervalDays: interval,
        fixedWeekday: fixedWeekday,
        nextDueAt: todayStr(),
        lastCompletedAt: null,
    };

    state.periodicTasks.push(newTask);

    // Clear form
    document.getElementById('inputPeriodicName').value = '';
    document.getElementById('inputInterval').value = '7';
    document.getElementById('inputWeekday').value = '';
    document.querySelectorAll('#zoneCheckboxes input[type="checkbox"]').forEach(c => c.checked = false);

    save();
    renderSettingsContent();
    renderAll();
}

function deletePeriodicTask(taskId) {
    state.periodicTasks = state.periodicTasks.filter(t => t.id !== taskId);
    delete state.todayLog.periodic[taskId];
    save();
    renderSettingsContent();
    renderAll();
}

// ===== РЕНДЕР ВСЕГО =====
function renderAll() {
    renderDate();
    renderDailyTasks();
    renderZoneTiles();
    renderProgress(); // Теперь прогресс рассчитывается строго ПОСЛЕ отрисовки контента
}

// ===== КАЛЕНДАРЬ =====
let calendarState = {
    mode: 'week',  // 'week' | 'month'
    baseDate: new Date(),
    selectedDate: null,
};

function initCalendar() {
    const modal = document.getElementById('calendarModal');
    const btnOpen = document.getElementById('btnCalendar');
    const btnClose = document.getElementById('btnCloseCalendar');

    btnOpen.addEventListener('click', () => {
        calendarState.baseDate = new Date();
        calendarState.selectedDate = null;
        modal.classList.add('open');
        renderCalendar();
    });

    btnClose.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    // Табы неделя/месяц
    document.getElementById('calTabWeek').addEventListener('click', () => {
        calendarState.mode = 'week';
        document.getElementById('calTabWeek').classList.add('active');
        document.getElementById('calTabMonth').classList.remove('active');
        calendarState.selectedDate = null;
        renderCalendar();
    });

    document.getElementById('calTabMonth').addEventListener('click', () => {
        calendarState.mode = 'month';
        document.getElementById('calTabMonth').classList.add('active');
        document.getElementById('calTabWeek').classList.remove('active');
        calendarState.selectedDate = null;
        renderCalendar();
    });

    // Навигация
    document.getElementById('calPrev').addEventListener('click', () => {
        const d = calendarState.baseDate;
        if (calendarState.mode === 'week') {
            d.setDate(d.getDate() - 7);
        } else {
            d.setMonth(d.getMonth() - 1);
        }
        calendarState.selectedDate = null;
        renderCalendar();
    });

    document.getElementById('calNext').addEventListener('click', () => {
        const d = calendarState.baseDate;
        if (calendarState.mode === 'week') {
            d.setDate(d.getDate() + 7);
        } else {
            d.setMonth(d.getMonth() + 1);
        }
        calendarState.selectedDate = null;
        renderCalendar();
    });
}

function getPeriodicTasksForDate(dateStr) {
    return state.periodicTasks.filter(t => {
        if (!t.nextDueAt) return false;
        // Задача попадает в дату если nextDueAt <= dateStr
        // Но нам нужно показать задачи, которые будут именно в этот день
        // Для этого эмулируем: задача с intervalDays, стартующая от nextDueAt
        const nextDue = new Date(t.nextDueAt + 'T00:00:00');
        const checkDate = new Date(dateStr + 'T00:00:00');

        if (checkDate < nextDue) return false;

        // Проверяем fixedWeekday
        if (t.fixedWeekday !== null && t.fixedWeekday !== undefined) {
            return checkDate.getDay() === t.fixedWeekday;
        }

        // Задача попадает на checkDate если разница дней кратна intervalDays
        const diffDays = Math.round((checkDate - nextDue) / (1000 * 60 * 60 * 24));
        return diffDays % t.intervalDays === 0;
    });
}

function renderCalendar() {
    const grid = document.getElementById('calGrid');
    const navTitle = document.getElementById('calNavTitle');
    grid.innerHTML = '';

    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const todayS = todayStr();

    if (calendarState.mode === 'week') {
        grid.className = 'cal-grid week-view';

        // Найти понедельник текущей недели baseDate
        const base = new Date(calendarState.baseDate);
        const dow = base.getDay();
        const monday = new Date(base);
        monday.setDate(base.getDate() - ((dow + 6) % 7));

        // Заголовок навигации
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        navTitle.textContent = `${monday.getDate()} - ${sunday.getDate()} ${monthNames[sunday.getMonth()]} ${sunday.getFullYear()}`;

        // Названия дней
        dayLabels.forEach(label => {
            const el = document.createElement('div');
            el.className = 'cal-day-label';
            el.textContent = label;
            grid.appendChild(el);
        });

        // Дни недели
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const tasks = getPeriodicTasksForDate(dateStr);

            const el = document.createElement('div');
            el.className = 'cal-day';
            if (dateStr === todayS) el.classList.add('today');
            if (dateStr === calendarState.selectedDate) el.classList.add('selected');
            if (tasks.length > 3) el.classList.add('has-many');

            const pct = (state.historyStat && state.historyStat[dateStr]) || 0;

            el.innerHTML = `
                <div class="cal-day-fill" style="--pct: ${pct}"></div>
                <span class="cal-day-num">${d.getDate()}</span>
                ${tasks.length > 0 ? '<span class="cal-day-dot"></span>' : ''}
            `;

            el.addEventListener('click', () => {
                calendarState.selectedDate = dateStr;
                renderCalendar();
                renderCalendarDayTasks(dateStr);
            });

            grid.appendChild(el);
        }
    } else {
        // Месяц
        grid.className = 'cal-grid month-view';
        const base = calendarState.baseDate;
        navTitle.textContent = `${monthNames[base.getMonth()]} ${base.getFullYear()}`;

        // Названия дней
        dayLabels.forEach(label => {
            const el = document.createElement('div');
            el.className = 'cal-day-label';
            el.textContent = label;
            grid.appendChild(el);
        });

        // Первый день месяца
        const firstDay = new Date(base.getFullYear(), base.getMonth(), 1);
        const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0);

        // Пустые ячейки до понедельника
        const startDow = (firstDay.getDay() + 6) % 7; // 0=Mon
        for (let i = 0; i < startDow; i++) {
            const prevDate = new Date(firstDay);
            prevDate.setDate(firstDay.getDate() - (startDow - i));
            const el = document.createElement('div');
            el.className = 'cal-day other-month';
            el.textContent = prevDate.getDate();
            grid.appendChild(el);
        }

        // Дни месяца
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const d = new Date(base.getFullYear(), base.getMonth(), day);
            const dateStr = d.toISOString().split('T')[0];
            const tasks = getPeriodicTasksForDate(dateStr);

            const el = document.createElement('div');
            el.className = 'cal-day';
            if (dateStr === todayS) el.classList.add('today');
            if (dateStr === calendarState.selectedDate) el.classList.add('selected');
            if (tasks.length > 3) el.classList.add('has-many');

            const pct = (state.historyStat && state.historyStat[dateStr]) || 0;

            el.innerHTML = `
                <div class="cal-day-fill" style="--pct: ${pct}"></div>
                <span class="cal-day-num">${day}</span>
                ${tasks.length > 0 ? '<span class="cal-day-dot"></span>' : ''}
            `;

            el.addEventListener('click', () => {
                calendarState.selectedDate = dateStr;
                renderCalendar();
                renderCalendarDayTasks(dateStr);
            });

            grid.appendChild(el);
        }

        // Пустые ячейки в конце
        const endDow = (lastDay.getDay() + 6) % 7;
        for (let i = endDow + 1; i < 7; i++) {
            const nextDate = new Date(lastDay);
            nextDate.setDate(lastDay.getDate() + (i - endDow));
            const el = document.createElement('div');
            el.className = 'cal-day other-month';
            el.textContent = nextDate.getDate();
            grid.appendChild(el);
        }
    }

    // Показать задачи выбранного дня
    if (calendarState.selectedDate) {
        renderCalendarDayTasks(calendarState.selectedDate);
    } else {
        renderCalendarDayTasks(todayS);
    }
}

function renderCalendarDayTasks(dateStr) {
    const titleEl = document.getElementById('calDayTitle');
    const listEl = document.getElementById('calTaskList');

    const d = new Date(dateStr + 'T00:00:00');
    const { day, full } = formatDate(d);
    titleEl.textContent = `${day}, ${full}`;

    const periodicTasks = getPeriodicTasksForDate(dateStr);
    const isToday = dateStr === todayStr();

    listEl.innerHTML = '';

    // Ежедневные задачи (в сворачиваемом спойлере)
    const allDaily = [...state.dailyTasks.morning, ...state.dailyTasks.evening];
    if (allDaily.length > 0) {
        const detailsLi = document.createElement('li');
        detailsLi.style.listStyle = 'none'; // Убираем маркер списка
        detailsLi.innerHTML = `
            <details class="cal-daily-details">
                <summary class="cal-daily-summary">Ежедневные рутины (${allDaily.length})</summary>
                <ul class="cal-daily-inner-list"></ul>
            </details>
        `;
        const innerList = detailsLi.querySelector('.cal-daily-inner-list');

        allDaily.forEach(task => {
            const li = document.createElement('li');
            li.className = 'cal-task-item';
            li.innerHTML = `
                <span class="zone-dot" style="background: var(--primary-light)"></span>
                <span class="task-name">${task.text}</span>
                <span class="task-interval-badge">ежедневно</span>
            `;
            innerList.appendChild(li);
        });

        listEl.appendChild(detailsLi);
    }

    // Периодические задачи
    periodicTasks.forEach(task => {
        const zoneColor = task.zones.length === 1 ? (ZONES[task.zones[0]]?.color || '#ccc') : 'var(--primary)';
        const li = document.createElement('li');
        li.className = 'cal-task-item';
        li.innerHTML = `
            <span class="zone-dot" style="background: ${zoneColor}"></span>
            <span class="task-name">${task.name}</span>
            <span class="task-interval-badge">каждые ${task.intervalDays} дн.</span>
        `;
        listEl.appendChild(li);
    });

    if (allDaily.length === 0 && periodicTasks.length === 0) {
        listEl.innerHTML = '<li class="cal-task-item" style="justify-content:center;color:var(--text-muted)">Нет задач на этот день</li>';
    }
}

// ===== ЭФФЕКТЫ =====
const SoundController = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume(); // Пробуждаем синхронно
        }
    },
    playPop() {
        try {
            if (!state.soundEnabled) return;
            const audio = new Audio('assets/42345235.mp3');
            audio.volume = 0.15; // Выровнено по громкости мяу
            audio.play().catch(() => {});
        } catch (e) {
            console.warn("Sound playPop failed:", e);
        }
    },
    playMeow() {
        try {
            if (!state.soundEnabled) return;
            const sounds = [
                'assets/animals-cat-blue-meow.mp3',
                'assets/jg-032316-sfx-cat-meow.mp3'
            ];
            // Чередуем звуки по очереди через счетчик индекса
            if (this.meowIndex === undefined) this.meowIndex = 0;
            const currentSound = sounds[this.meowIndex % sounds.length];
            const audio = new Audio(currentSound);
            audio.volume = 0.15; // Нежное тихое мяу
            audio.play().catch(() => {});
            this.meowIndex++;
        } catch (e) {
            console.warn("Sound playMeow failed:", e);
        }
    }
};

const CAT_PHRASES = [
    "Мурр! Время наводить лоск! 🐾",
    "Чистый дом — счастливый котик! 😸",
    "Ванная заждалась своего героя 🫧",
    "Ух ты, сколько блеска! ✨",
    "Пора отдохнуть и попить чаю ☕️",
    "Кухня блестит! Одобряю 🐟",
    "Ты делаешь этот мир чище 🌸",
    "Помурчим вместе после уборки? 🧸",
    "Вижу старания! Молодец 🏆"
];

function updateCatThoughts() {
    const el = document.getElementById('catThoughts');
    if (!el) return;
    el.textContent = CAT_PHRASES[Math.floor(Math.random() * CAT_PHRASES.length)];
}

function triggerCatReaction() {
    const img = document.querySelector('.cats-logo-img');
    if (!img) return;
    img.classList.remove('react');
    void img.offsetWidth; // Триггер пересчета стилей (флош)
    img.classList.add('react');
}

function triggerSakura() {
    const ring = document.querySelector('.progress-ring-container');
    if (!ring) return;
    const rect = ring.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    for (let i = 0; i < 30; i++) {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.textContent = '🌸';
        petal.style.left = `${startX}px`;
        petal.style.top = `${startY}px`;

        // Случайные разлёты
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 100;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const rot = Math.random() * 360;

        petal.style.setProperty('--dx', `${dx}px`);
        petal.style.setProperty('--dy', `${dy}px`);
        petal.style.setProperty('--rot', `${rot}deg`);

        document.body.appendChild(petal);

        petal.addEventListener('animationend', () => petal.remove());
    }
}

// ===== АВТОМАТИЧЕСКАЯ СМЕНА ТЕМЫ ПО ВРЕМЕНИ СУТОК =====
function applyTimeTheme() {
    const hour = new Date().getHours();
    const body = document.body;
    body.classList.remove('theme-day', 'theme-blueberry');
    
    const stop0 = document.querySelector('#ring-gradient stop:first-child');
    const stop1 = document.querySelector('#ring-gradient stop:last-child');

    // Дневная тема с 06:00 до 19:00 (согласно прошлым договоренностям)
    if (hour >= 6 && hour < 19) {
        body.classList.add('theme-day');
        if (stop0) { stop0.setAttribute('stop-color', '#F4A97A'); }
        if (stop1) { stop1.setAttribute('stop-color', '#d65e9e'); }
    } else {
        // Черника с 19:00 до 06:00
        body.classList.add('theme-blueberry');
        if (stop0) { stop0.setAttribute('stop-color', '#c0669b'); }
        if (stop1) { stop1.setAttribute('stop-color', '#af85b6'); }
    }
    
    // Оставляем исходный звук, чтобы не ломать логику пользователю
    state.soundEnabled = localStorage.getItem('ch_sound') !== 'false';

    // Обновить иконку динамика
    const btnSound = document.getElementById('btnSound');
    if (btnSound) {
        btnSound.innerHTML = state.soundEnabled ? '<i class="ph-bold ph-speaker-high"></i>' : '<i class="ph-bold ph-speaker-slash"></i>';
    }
}

// ===== ДАТА И ПОГОДА В ШАПКЕ =====
const WEATHER_LAT = 56.01; // Пушкино, Московская область
const WEATHER_LON = 37.85;
const WEATHER_CACHE_KEY = 'ch_weather_cache';
const WEATHER_CACHE_TTL = 30 * 60 * 1000; // 30 минут

function renderHeaderDate() {
    const numEl = document.getElementById('headerDateNum');
    const subEl = document.getElementById('headerDateSub');
    if (!numEl || !subEl) return;
    const now = new Date();
    const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    numEl.textContent = now.getDate();
    subEl.textContent = `${months[now.getMonth()]} · ${days[now.getDay()]}`;
}

// WMO Weather Interpretation Codes -> эмодзи
function weatherCodeToEmoji(code) {
    if (code === 0) return '\u2600\uFE0F';         // ясно
    if (code <= 3) return '\u26C5';                  // облачно
    if (code <= 48) return '\uD83C\uDF2B\uFE0F';    // туман
    if (code <= 57) return '\uD83C\uDF27\uFE0F';    // морось
    if (code <= 67) return '\uD83C\uDF27\uFE0F';    // дождь
    if (code <= 77) return '\u2744\uFE0F';           // снег
    if (code <= 82) return '\uD83C\uDF26\uFE0F';    // ливень
    if (code <= 86) return '\uD83C\uDF28\uFE0F';    // снегопад
    if (code >= 95) return '\u26C8\uFE0F';           // гроза
    return '\u2601\uFE0F'; // облачно по умолчанию
}

async function fetchWeather() {
    const iconEl = document.getElementById('weatherIcon');
    const tempEl = document.getElementById('weatherTemp');
    if (!iconEl || !tempEl) return;

    // Проверяем кэш
    try {
        const cached = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY));
        if (cached && (Date.now() - cached.ts < WEATHER_CACHE_TTL)) {
            iconEl.textContent = cached.icon;
            tempEl.textContent = cached.temp;
            return;
        }
    } catch(e) { /* кэш битый - ок, запросим заново */ }

    // Запрос Open-Meteo (бесплатный, без ключа)
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current_weather=true&timezone=Europe%2FMoscow`;
        const resp = await fetch(url);
        const data = await resp.json();
        const cw = data.current_weather;
        const icon = weatherCodeToEmoji(cw.weathercode);
        const temp = `${Math.round(cw.temperature)}\u00B0`;

        iconEl.textContent = icon;
        tempEl.textContent = temp;

        // Кэшируем
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
            icon, temp, ts: Date.now()
        }));
    } catch(e) {
        // Офлайн или ошибка - показываем что есть в кэше или «—»
        tempEl.textContent = '\u2014';
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    applyTimeTheme(); // Тема по времени суток
    setInterval(applyTimeTheme, 60000); // Проверять каждую минуту

    loadFromLocal();

    // === ОДНОРАЗОВАЯ МИГРАЦИЯ: холодильник -> кухня ===
    if (!localStorage.getItem('ch_migrated_fridge')) {
        const fridge = state.periodicTasks.find(t => t.name && t.name.toLowerCase().includes('\u0445\u043e\u043b\u043e\u0434\u0438\u043b\u044c\u043d\u0438\u043a'));
        if (fridge) {
            fridge.zones = ['kitchen'];
            save();
        }
        localStorage.setItem('ch_migrated_fridge', '1');
    }

    updateTodayStat();
    renderAll();
    updateCatThoughts();
    renderHeaderDate();
    fetchWeather();

    // Кнопка переключения звука
    const btnSound = document.getElementById('btnSound');
    if (btnSound) {
        btnSound.innerHTML = state.soundEnabled ? '<i class="ph-bold ph-speaker-high"></i>' : '<i class="ph-bold ph-speaker-slash"></i>';
        btnSound.addEventListener('click', () => {
            state.soundEnabled = !state.soundEnabled;
            localStorage.setItem('ch_sound', state.soundEnabled);
            btnSound.innerHTML = state.soundEnabled ? '<i class="ph-bold ph-speaker-high"></i>' : '<i class="ph-bold ph-speaker-slash"></i>';
            SoundController.playPop(); // Тестовый отзыв при клике на динамик
        });
    }

    initSettingsModal();
    initCalendar();
    initExtraDone();
    initFirebaseSync();
}

// Запуск
document.addEventListener('DOMContentLoaded', init);
