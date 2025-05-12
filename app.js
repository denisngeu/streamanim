document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedAnimes();
    displayFavorites();
});

async function loadFeaturedAnimes() {
    try {
        const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=5");
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const { data } = await response.json();
        displayAnimes(data, "featured-list");
    } catch (error) {
        console.error("Erreur lors du chargement des animes populaires :", error);
        document.getElementById("featured-list").innerHTML = `<p>${error.message}</p>`;
    }
}

async function searchAnime(page = 1) {
    const query = document.getElementById("search").value.trim();
    if (!query) return alert("Veuillez entrer un titre d'anime.");
    await fetchAnimes(query, page);
}

async function fetchAnimes(query, page = 1) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=10`);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const { data, pagination } = await response.json();
        displayAnimes(data, "anime-list");
        displayPagination(query, pagination);
    } catch (error) {
        console.error("Erreur lors de la recherche d'anime :", error);
        document.getElementById("anime-list").innerHTML = `<p>${error.message}</p>`;
    }
}

function displayAnimes(animes, containerId) {
    const animeList = document.getElementById(containerId);
    animeList.innerHTML = animes.map(anime => `
        <div class="anime-card">
            <img src="${anime.images?.jpg?.image_url || ''}" alt="${anime.title}" loading="lazy">
            <h3 class="anime-title">${anime.title}</h3>
            <ul class="anime-info">
                <li><strong>Score :</strong> ${anime.score || 'N/A'}</li>
                <li><strong>Episodes :</strong> ${anime.episodes || 'Inconnu'}</li>
                <li><strong>Synopsis :</strong> ${anime.synopsis ? anime.synopsis.slice(0, 150) + '...' : 'Non disponible.'}</li>
            </ul>
            <button onclick="addToFavorites('${anime.title}')"><i class="fa-solid fa-star"></i> Ajouter aux favoris</button>
        </div>
    `).join("");
}

function displayFavorites() {
    const favoritesList = document.getElementById("favorites-list");
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = favorites.length 
        ? favorites.map(title => `<li>${title} <button onclick="removeFavorite('${title}')">❌</button></li>`).join('')
        : '<p>Vous n\'avez aucun favori.</p>';
}

function addToFavorites(title) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(title)) {
        favorites.push(title);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        showNotification(`${title} ajouté aux favoris.`);
    } else {
        alert("Cet anime est déjà dans vos favoris.");
    }
}

function removeFavorite(title) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav !== title);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    showNotification(`${title} retiré des favoris.`);
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("visible");
        setTimeout(() => {
            notification.classList.remove("visible");
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

function displayPagination(query, pagination) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= pagination.last_visible_page; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.onclick = () => searchAnime(i);
        paginationContainer.appendChild(pageButton);
    }
}
