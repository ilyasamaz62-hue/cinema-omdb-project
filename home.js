// home.js - Page d'accueil

document.addEventListener('DOMContentLoaded', async function() {
    console.log("Accueil chargé");
    
    const container = document.getElementById('movies-container');
    const loadBtn = document.getElementById('load-more-btn');
    
    if (!container) return;
    
    // Afficher films tendance
    try {
        const movies = await getTrendingMovies();
        
        container.innerHTML = '';
        
        movies.forEach(movie => {
            container.innerHTML += createMovieCard(movie, true);
        });
        
        addCardEvents();
        
    } catch (error) {
        console.log("Erreur:", error);
        container.innerHTML = '<p>Problème de chargement des films</p>';
    }
    
    // Bouton "Voir plus"
    if (loadBtn) {
        loadBtn.addEventListener('click', async function() {
            loadBtn.disabled = true;
            loadBtn.textContent = 'Chargement...';
            
            // Simuler recherche films 2024
            const result = await searchMovies("2024", 1);
            
            if (result.Response === "True" && result.Search.length > 0) {
                // Ajouter les nouveaux films
                result.Search.forEach(movie => {
                    container.innerHTML += createMovieCard(movie, false);
                });
                
                addCardEvents();
                
                // Cacher bouton après
                loadBtn.style.display = 'none';
                
            } else {
                alert("Pas de films de 2024 trouvés");
            }
            
            loadBtn.disabled = false;
            loadBtn.textContent = '🔽 Voir plus de films (2024)';
        });
    }
});

// Ajouter événements aux cartes
function addCardEvents() {
    const cards = document.querySelectorAll('.movie-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Pas si on clique sur le lien
            if (!e.target.closest('.btn-details')) {
                const id = this.getAttribute('data-id');
                if (id) {
                    window.location.href = `movie.html?id=${id}`;
                }
            }
        });
    });
}