// Словник для картинок м'язів
const muscleImages = {
    "Chest": "Chest.png",
    "Biceps": "Biceps.png",
    "Triceps": "Triceps.png",
    "Forearms": "Forearms.png",
    "Shoulders": "Shoulders.png",
    "Upper Back": "UpperBack.png",
    "Abdominals": "Abdominals.png",
    "Calves": "Calves.png",
    "Glutes": "Glutes.png"
};

document.addEventListener('DOMContentLoaded', () => {
    
    //  ЛОГІКА ДЛЯ (index.html) 
    const welcomeHeader = document.getElementById('about');
    if (welcomeHeader) {
        // Бере збережене ім'я з пам'яті браузера
        const savedName = localStorage.getItem('username');
        if (savedName) {
            welcomeHeader.textContent = `Hello ${savedName}`;
        } else {
            welcomeHeader.textContent = "Hello Username";
        }
    }

    //  ЛОГІКА ДЛЯ СТОРІНКИ ПРОФІЛЮ (profile.html) 
    const submitBtn = document.getElementById('Submit');
    if (submitBtn) {
        // Якщо в пам'яті вже є дані, підставть їх в інпути автоматично
        const savedName = localStorage.getItem('username');
        const savedHeight = localStorage.getItem('userHeight');
        const savedWeight = localStorage.getItem('userWeight');
        
        if (savedName) document.getElementById('profileName').value = savedName;
        if (savedHeight) document.getElementById('profileHeight').value = savedHeight;
        if (savedWeight) document.getElementById('profileWeight').value = savedWeight;

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Зупиняє перезавантаження сторінки форми
            
            const nameValue = document.getElementById('profileName').value.trim();
            const heightValue = document.getElementById('profileHeight').value.trim();
            const weightValue = document.getElementById('profileWeight').value.trim();

            if (nameValue === "") {
                alert("Please enter your name");
                return;
            }

            // Зберігає кожен параметр окремо в localStorage
            localStorage.setItem('username', nameValue);
            localStorage.setItem('userHeight', heightValue);
            localStorage.setItem('userWeight', weightValue);

            alert('Profile saved successfully!');
        });
    }

    // ЛОГІКА ДЛЯ СТОРІНКИ ТРЕНУВАНЬ (inmain.html) 
    const muscleInput = document.getElementById('muscleGroup');
    const resultsDiv = document.getElementById('exerciseResults');

    if (muscleInput && resultsDiv) {
        muscleInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            const match = Object.keys(muscleImages).find(
                key => key.toLowerCase() === val.toLowerCase()
            );

            if (match) {
                resultsDiv.innerHTML = `
                    <div class="image-preview" style="margin-top: 20px;">
                        <p style="color: white; font-weight: bold;">Target: ${match}</p>
                        <img src="images/${muscleImages[match]}" 
                             alt="${match}" 
                             style="width: 100%; max-width: 300px; border-radius: 15px; border: 2px solid white;">
                    </div>
                `;
            } else {
                resultsDiv.innerHTML = val.length > 0 ? '<p style="color: #ccc;">Searching...</p>' : '';
            }
        });
    }
});