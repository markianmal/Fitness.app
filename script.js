// 1. База даних (лише назви вправ та робочі посилання на картинки)
const exercises = [
    { name: "Bench press", img: "https://placehold.co/100x100/333/white?text=Bench+Press" },
    { name: "Hammer bicep curl", img: "https://placehold.co/100x100/333/white?text=Hammer+Curl" },
    { name: "Deadlift", img: "https://placehold.co/100x100/333/white?text=Deadlift" },
    { name: "Squats", img: "https://placehold.co/100x100/333/white?text=Squats" },
    { name: "Pushups", img: "https://placehold.co/100x100/333/white?text=Pushups" },
    { name: "Pull-ups", img: "https://placehold.co/100x100/333/white?text=Pullups" }
];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('Search');
    const resultsContainer = document.getElementById('exerciseResults');

    if (searchInput && resultsContainer) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            resultsContainer.innerHTML = '';

            if (query.length > 0) {
                const filtered = exercises.filter(ex =>
                    ex.name.toLowerCase().includes(query)
                );

                filtered.forEach(ex => {
                    const card = document.createElement('div');
                    card.className = 'exercise-card';
                    card.innerHTML = `
                        <img src="${ex.img}" alt="${ex.name}" width="80" style="border-radius: 8px;">
                        <div style="margin-left: 15px;">
                            <strong style="color: white; font-size: 1.2rem;">${ex.name}</strong>
                        </div>
                    `;
                    resultsContainer.appendChild(card);
                });
            }
        });
    }
});