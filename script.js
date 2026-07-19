// База даних вправ
const exercises = [
    { name: "Bench press", muscle: "Chest", img: "Chest.png" },
    { name: "Hammer bicep curl", muscle: "Biceps", img: "Biceps.png" },
    { name: "Barbell curl", muscle: "Biceps", img: "Biceps.png" },
    { name: "Triceps pushdown", muscle: "Triceps", img: "Triceps.png" },
    { name: "Deadlift", muscle: "Back", img: "UpperBack.png" },
    { name: "Squats", muscle: "Quads", img: "Calves.png" } // Заміни на реальні картинки за потреби
];

let timerInterval;

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. РЕДІРЕКТ ПРИ ПЕРШОМУ ВХОДІ ===
    const isProfileSaved = localStorage.getItem('username');
    const currentFile = window.location.pathname.split("/").pop();
    
    // Якщо зайшли на сайт (index.html або корінь), а профілю немає — кидаємо на profile.html
    if (!isProfileSaved && (currentFile === "index.html" || currentFile === "")) {
        window.location.href = "profile.html";
        return;
    }

    // === 2. ГОЛОВНА СТОРІНКА (index.html) ===
    const welcomeHeader = document.getElementById('about');
    if (welcomeHeader) {
        welcomeHeader.textContent = `Hello ${isProfileSaved || "Username"}`;
        displayWorkoutHistory();
    }

    // === 3. ПРОФІЛЬ (profile.html) ===
    const submitBtn = document.getElementById('Submit');
    if (submitBtn) {
        // Автозаповнення
        if (isProfileSaved) document.getElementById('profileName').value = isProfileSaved;
        const savedHeight = localStorage.getItem('userHeight');
        const savedWeight = localStorage.getItem('userWeight');
        if (savedHeight) document.getElementById('profileHeight').value = savedHeight;
        if (savedWeight) document.getElementById('profileWeight').value = savedWeight;

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = document.getElementById('profileName').value.trim();
            if (!name) return alert("Please enter your name");
            
            localStorage.setItem('username', name);
            localStorage.setItem('userHeight', document.getElementById('profileHeight').value);
            localStorage.setItem('userWeight', document.getElementById('profileWeight').value);
            
            alert('Profile saved successfully!');
            window.location.href = "index.html"; // Після збереження ведемо розробника на головну
        });
    }

    // === 4. СЕКУНДОМІР (inmain.html) ===
    const durationHeader = document.querySelector('h1[for=""]'); // Шукає заголовок з тривалістю
    if (durationHeader && currentFile === "inmain.html") {
        startStopwatch(durationHeader);
        
        // Обробка завершення тренування
        const endBtn = document.getElementById('ainmain');
        if (endBtn) {
            endBtn.addEventListener('click', (e) => {
                e.preventDefault();
                finishWorkout();
            });
        }

        // Відображення поточної вибраної вправи (якщо є)
        loadCurrentExercise();
    }

    // === 5. СТОРІНКА ПОШУКУ ВПРАВ (inmainexercise.html) ===
    const searchInput = document.getElementById('search');
    const resultsDiv = document.getElementById('exerciseResults');
    if (searchInput && resultsDiv) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            resultsDiv.innerHTML = '';

            if (query.length > 0) {
                const filtered = exercises.filter(ex => 
                    ex.name.toLowerCase().includes(query) || 
                    ex.muscle.toLowerCase().includes(query)
                );

                filtered.forEach(ex => {
                    const card = document.createElement('div');
                    card.style.cssText = "background:#444; padding:10px; margin:10px; border-radius:10px; color:white; display:flex; gap:15px; align-items:center;";
                    card.innerHTML = `
                        <img src="images/${ex.img}" alt="${ex.muscle}" style="width:60px; height:60px; border-radius:5px; object-fit:cover;">
                        <div>
                            <strong style="font-size:1.1rem;">${ex.name}</strong>
                            <p style="margin:0; color:#aaa; font-size:0.9rem;">${ex.muscle}</p>
                            <button class="add-ex-btn" data-name="${ex.name}" style="margin-top:5px; background:navy; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Select</button>
                        </div>
                    `;
                    resultsDiv.appendChild(card);
                });

                // Навішуємо подію вибору на створені кнопки
                document.querySelectorAll('.add-ex-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const exName = e.target.getAttribute('data-name');
                        localStorage.setItem('currentSelectedExercise', exName);
                        window.location.href = "inmain.html";
                    });
                });
            }
        });
    }
});

// ЛОГІКА СЕКУНДОМІРА
function startStopwatch(element) {
    let startTime = localStorage.getItem('workoutStartTime');
    if (!startTime) {
        startTime = Date.now();
        localStorage.setItem('workoutStartTime', startTime);
    }

    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        element.textContent = `Duration ${minutes}:${seconds}`;
    }, 1000);
}

// Завантаження обраної вправи на робочий екран
function loadCurrentExercise() {
    const activeEx = localStorage.getItem('currentSelectedExercise');
    const container = document.getElementById('exerciseResults');
    if (activeEx && container) {
        container.innerHTML = `
            <div style="background:#222; padding:15px; border-radius:10px; color:white; margin:10px;">
                <h3 style="margin:0 0 10px 0; color:yellow;">Active Exercise: ${activeEx}</h3>
            </div>
        `;
    }
}

// ЗБЕРЕЖЕННЯ ТРЕНУВАННЯ В ІСТОРІЮ
function finishWorkout() {
    clearInterval(timerInterval);
    const startTime = localStorage.getItem('workoutStartTime');
    const activeEx = localStorage.getItem('currentSelectedExercise') || "General Workout";
    
    const sets = document.getElementById('setsInput').value || 0;
    const reps = document.getElementById('repsInput').value || 0;
    const weight = document.getElementById('weightInput').value || 0;

    let durationText = "00:00";
    if (startTime) {
        const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        durationText = `${m}:${s}`;
    }

    const workoutRecord = {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        exercise: activeEx,
        details: `${sets}x${reps} @ ${weight}kg`,
        duration: durationText
    };

    // Дістаємо стару історію або створюємо новий масив
    const history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    history.unshift(workoutRecord); // Нові тренування додаємо на початок
    localStorage.setItem('workoutHistory', JSON.stringify(history));

    // Очищаємо тимчасові дані поточної сесії
    localStorage.removeItem('workoutStartTime');
    localStorage.removeItem('currentSelectedExercise');

    alert("Workout finished and saved!");
    window.location.href = "index.html";
}

// ВІДОБРАЖЕННЯ ІСТОРІЇ НА ГОЛОВНІЙ
function displayWorkoutHistory() {
    const historyContainer = document.querySelector('main section');
    const history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    
    // Видаляємо старі статичні h1 календаря, якщо вони є
    const headersToRemove = historyContainer.querySelectorAll('h1:not(#about)');
    headersToRemove.forEach(h => h.remove());

    if (history.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = "No workouts recorded yet. Hit 'New workout' to start!";
        emptyMsg.style.color = "#ccc";
        emptyMsg.style.marginLeft = "10px";
        historyContainer.appendChild(emptyMsg);
        return;
    }

    history.forEach(workout => {
        const block = document.createElement('div');
        block.style.cssText = "background:#333; padding:12px; margin:10px; border-radius:10px; color:white; border-left: 5px solid navy;";
        block.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:0.9rem; color: #ffeb3b;">
                <span>${workout.date}</span>
                <span>⏱️ ${workout.duration}</span>
            </div>
            <div style="margin-top:5px; font-size:1.1rem;">${workout.exercise}</div>
            <div style="color:#aaa; font-size:0.95rem;">Result: ${workout.details}</div>
        `;
        historyContainer.appendChild(block);
    });
}