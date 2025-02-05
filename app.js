document.addEventListener("DOMContentLoaded", function() {
    console.log("App loaded");
    fetchFeaturedAnimes();
    fetchLatestAnimes();
    loadWatchHistory();
});

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

function loginUser() {
    alert("Ouverture du formulaire de connexion.");
}

function registerUser() {
    alert("Ouverture du formulaire d'inscription.");
}

async function fetchFeaturedAnimes() {
    try {
        let response = await fetch("https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=5");
        let data = await response.json();
        displayAnimes(data.data, "featured-list");
    } catch (error) {
        console.error("Erreur lors du chargement des animes à la une :", error);
    }
}

async function fetchLatestAnimes() {
    try {
        let response = await fetch("https://api.jikan.moe/v4/anime?order_by=start_date&sort=desc&limit=10");
        let data = await response.json();
        displayAnimes(data.data, "anime-list");
    } catch (error) {
        console.error("Erreur lors du chargement des derniers animes :", error);
    }
}

function displayAnimes(animes, containerId) {
    let animeList = document.getElementById(containerId);
    animeList.innerHTML = "";
    animes.forEach(anime => {
        let animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <h3>${anime.title}</h3>
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <p>Score : ${anime.score}</p>
            <button onclick="watchAnime('${anime.title}')">Regarder</button>
        `;
        animeList.appendChild(animeCard);
    });
}

function searchAnime() {
    let query = document.getElementById("search").value;
    if (query.trim() === "") return;
    fetchAnimes(query);
}

async function fetchAnimes(query) {
    try {
        let response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`);
        let data = await response.json();
        displayAnimes(data.data, "anime-list");
    } catch (error) {
        console.error("Erreur lors de la recherche d'anime :", error);
    }
}

function filterByCategory(category) {
    fetchAnimes(category);
}

function watchAnime(title) {
    alert(`Lecture de l'anime : ${title}`);
    saveToWatchHistory(title);
}

function saveToWatchHistory(title) {
    let history = JSON.parse(localStorage.getItem("watchHistory")) || [];
    if (!history.includes(title)) {
        history.push(title);
    }
    localStorage.setItem("watchHistory", JSON.stringify(history));
    loadWatchHistory();
}

function loadWatchHistory() {
    let historyList = document.getElementById("watch-history");
    if (!historyList) return;
    let history = JSON.parse(localStorage.getItem("watchHistory")) || [];
    historyList.innerHTML = "";
    history.forEach(title => {
        let item = document.createElement("p");
        item.textContent = title;
        historyList.appendChild(item);
    });
}
