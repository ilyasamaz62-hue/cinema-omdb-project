// script.js - Mes fonctions principales

// Ma clé API (j'ai obtenu ça sur omdbapi.com)
const API_KEY = '4be25099';
const BASE_URL = 'https://www.omdbapi.com/';

// Variables globales
let currentPage = 1;
let currentSearch = '';

// Films que j'ai mis en dur au cas où
const DEMO_MOVIES = {
    "tt1375666": {
        "Title": "Inception",
        "Year": "2010",
        "Rated": "PG-13",
        "Released": "16 Jul 2010",
        "Runtime": "148 min",
        "Genre": "Action, Adventure, Sci-Fi",
        "Director": "Christopher Nolan",
        "Writer": "Christopher Nolan",
        "Actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
        "Plot": "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "Language": "English, Japanese, French",
        "Country": "USA, UK",
        "Awards": "Won 4 Oscars. 157 wins & 220 nominations total",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        "Ratings": [
            {"Source": "Internet Movie Database", "Value": "8.8/10"},
            {"Source": "Rotten Tomatoes", "Value": "87%"},
            {"Source": "Metacritic", "Value": "74/100"}
        ],
        "Metascore": "74",
        "imdbRating": "8.8",
        "imdbVotes": "2,396,928",
        "imdbID": "tt1375666",
        "Type": "movie",
        "DVD": "07 Dec 2010",
        "BoxOffice": "$292,576,195",
        "Production": "Warner Bros. Pictures",
        "Website": "N/A"
    },
    "tt0468569": {
        "Title": "The Dark Knight",
        "Year": "2008",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
        "imdbID": "tt0468569",
        "Type": "movie"
    },
    "tt6751668": {
        "Title": "Parasite",
        "Year": "2019", 
        "Poster": "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
        "imdbID": "tt6751668",
        "Type": "movie"
    }
};

// Fonction pour rechercher
async function searchMovies(query, page = 1) {
    console.log("Recherche:", query, "page:", page);
    
    // Si query vide ou trop court
    if (!query || query.length < 2) {
        return { Search: [], totalResults: "0", Response: "False" };
    }
    
    // Si API ne marche pas, utiliser demo
    if (API_KEY === '4be25099') {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const allMovies = [
            { Title: "Inception", Year: "2010", imdbID: "tt1375666", Type: "movie", Poster: DEMO_MOVIES["tt1375666"].Poster },
            { Title: "The Dark Knight", Year: "2008", imdbID: "tt0468569", Type: "movie", Poster: DEMO_MOVIES["tt0468569"].Poster },
            { Title: "Parasite", Year: "2019", imdbID: "tt6751668", Type: "movie", Poster: DEMO_MOVIES["tt6751668"].Poster },
            { Title: "Interstellar", Year: "2014", imdbID: "tt0816692", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
            { Title: "The Matrix", Year: "1999", imdbID: "tt0133093", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" }
        ];
        
        const filtered = allMovies.filter(movie => 
            movie.Title.toLowerCase().includes(query.toLowerCase())
        );
        
        // Pagination simple
        const perPage = 4;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const result = filtered.slice(start, end);
        
        return {
            Search: result,
            totalResults: filtered.length.toString(),
            Response: result.length > 0 ? "True" : "False"
        };
    }
    
    // Sinon utiliser vraie API
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Erreur API:", error);
        return { Search: [], totalResults: "0", Response: "False", Error: "API error" };
    }
}

// Fonction pour détails film
async function getMovieDetails(imdbID) {
    console.log("Détails pour:", imdbID);
    
    // Vérifier dans demo movies
    if (DEMO_MOVIES[imdbID]) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { ...DEMO_MOVIES[imdbID], Response: "True" };
    }
    
    // Sinon API
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Erreur détails:", error);
        return {
            Response: "False",
            Error: "Film non trouvé"
        };
    }
}

// Fonction pour créer carte film HTML
function createMovieCard(movie, showSummary = false) {
    const poster = movie.Poster && movie.Poster !== 'N/A' 
        ? movie.Poster 
        : 'https://via.placeholder.com/300x450?text=No+Poster';
    
    let summaryHTML = '';
    if (showSummary && movie.Plot) {
        const shortPlot = movie.Plot.length > 120 ? movie.Plot.substring(0, 120) + '...' : movie.Plot;
        summaryHTML = `<p class="movie-summary">${shortPlot}</p>`;
    } else if (showSummary && movie.summary) {
        summaryHTML = `<p class="movie-summary">${movie.summary}</p>`;
    }
    
    return `
        <div class="movie-card" data-id="${movie.imdbID}">
            <img src="${poster}" alt="${movie.Title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
                ${summaryHTML}
                <a href="movie.html?id=${movie.imdbID}" class="btn-details">
                    👁️ Voir détails
                </a>
            </div>
        </div>
    `;
}

// Formater date en français
function formatFrenchDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'Non disponible';
    
    try {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateString;
    }
}

// Films tendance pour accueil
async function getTrendingMovies() {
    return [
        { ...DEMO_MOVIES["tt1375666"], summary: "Un voleur qui vole des secrets dans les rêves..." },
        { ...DEMO_MOVIES["tt0468569"], summary: "Batman affronte le Joker à Gotham City..." },
        { ...DEMO_MOVIES["tt6751668"], summary: "Une famille pauvre infiltre une famille riche..." }
    ];
}

console.log("Script principal chargé");