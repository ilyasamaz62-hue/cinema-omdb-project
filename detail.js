// detail.js - Page détails film

document.addEventListener('DOMContentLoaded', async function() {
    console.log("Page détails chargée");
    
    const detailsDiv = document.getElementById('movie-details');
    if (!detailsDiv) return;
    
    // Récupérer l'ID depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        detailsDiv.innerHTML = '<p>Aucun film sélectionné</p>';
        return;
    }
    
    // Charger détails
    const movie = await getMovieDetails(movieId);
    
    if (movie.Response === "True") {
        displayMovieDetails(movie);
    } else {
        detailsDiv.innerHTML = `
            <div class="movie-detail">
                <h2>Film non trouvé</h2>
                <p>L'ID ${movieId} ne correspond à aucun film.</p>
                <p>Retournez à la <a href="search.html">recherche</a>.</p>
            </div>
        `;
    }
});

function displayMovieDetails(movie) {
    const detailsDiv = document.getElementById('movie-details');
    
    // Formater date DVD
    const dvdDate = formatFrenchDate(movie.DVD);
    
    // Créer HTML notes si existent
    let ratingsHTML = '';
    if (movie.Ratings && movie.Ratings.length > 0) {
        ratingsHTML = `
            <div class="detail-item">
                <div class="detail-label">Notes :</div>
                ${movie.Ratings.map(r => `<div>${r.Source}: ${r.Value}</div>`).join('')}
            </div>
        `;
    }
    
    const html = `
        <div class="movie-detail">
            <div class="movie-header">
                <div class="movie-poster-large">
                    <img src="${movie.Poster}" alt="${movie.Title}" 
                         onerror="this.src='https://via.placeholder.com/300x450?text=Poster+Manquant'">
                </div>
                
                <div class="movie-main-info">
                    <h1>${movie.Title} <span class="year">(${movie.Year})</span></h1>
                    
                    <div class="movie-meta">
                        <span class="meta-item">${movie.Runtime}</span>
                        <span class="meta-item">${movie.Genre}</span>
                        <span class="meta-item">⭐ ${movie.imdbRating}/10</span>
                    </div>
                    
                    <p class="plot"><strong>Synopsis :</strong> ${movie.Plot || 'Non disponible'}</p>
                </div>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Réalisateur :</div>
                    <div>${movie.Director || 'Non disponible'}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Acteurs :</div>
                    <div>${movie.Actors || 'Non disponible'}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Scénariste :</div>
                    <div>${movie.Writer || 'Non disponible'}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Date de sortie :</div>
                    <div>${formatFrenchDate(movie.Released)}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Date DVD :</div>
                    <div>${dvdDate}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Langue :</div>
                    <div>${movie.Language || 'Non disponible'}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Pays :</div>
                    <div>${movie.Country || 'Non disponible'}</div>
                </div>
                
                ${ratingsHTML}
            </div>
        </div>
    `;
    
    detailsDiv.innerHTML = html;
}