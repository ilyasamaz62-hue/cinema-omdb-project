// search.js - Page recherche

document.addEventListener('DOMContentLoaded', function() {
    console.log("Page recherche chargée");
    
    const searchInput = document.getElementById('search-input');
    const resultsDiv = document.getElementById('search-results');
    const moreBtn = document.getElementById('more-results-btn');
    const moreContainer = document.getElementById('more-btn-container');
    
    if (!searchInput || !resultsDiv) return;
    
    let timeout = null;
    
    // Recherche en temps réel
    searchInput.addEventListener('input', function() {
        clearTimeout(timeout);
        
        const query = this.value.trim();
        
        if (query.length >= 3) {
            timeout = setTimeout(() => {
                doSearch(query, 1);
            }, 500); // 0.5 sec delay
        } else if (query.length === 0) {
            resultsDiv.innerHTML = '<p>Entrez un titre pour rechercher</p>';
            moreContainer.style.display = 'none';
        }
    });
    
    // Bouton "Plus de résultats"
    if (moreBtn) {
        moreBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                doSearch(query, currentPage + 1);
            }
        });
    }
    
    // Fonction de recherche
    async function doSearch(query, page) {
        resultsDiv.innerHTML = '<p>Recherche en cours...</p>';
        
        const result = await searchMovies(query, page);
        
        if (result.Response === "True" && result.Search.length > 0) {
            currentPage = page;
            currentSearch = query;
            
            // Afficher résultats
            if (page === 1) {
                resultsDiv.innerHTML = '';
            }
            
            result.Search.forEach(movie => {
                resultsDiv.innerHTML += createMovieCard(movie, false);
            });
            
            // Gérer bouton "Plus"
            const total = parseInt(result.totalResults);
            const shown = page * 4; // 4 par page dans demo
            
            if (shown < total) {
                moreContainer.style.display = 'block';
            } else {
                moreContainer.style.display = 'none';
            }
            
            // Ajouter événements
            const cards = document.querySelectorAll('.movie-card');
            cards.forEach(card => {
                card.addEventListener('click', function(e) {
                    if (!e.target.closest('.btn-details')) {
                        const id = this.getAttribute('data-id');
                        if (id) {
                            window.location.href = `movie.html?id=${id}`;
                        }
                    }
                });
            });
            
        } else {
            resultsDiv.innerHTML = '<p>Aucun film trouvé. Essayez un autre titre.</p>';
            moreContainer.style.display = 'none';
        }
    }
    
    // Focus sur input
    searchInput.focus();
});