const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");
const loadingIndicator = document.getElementById("loading");
const errorContainer = document.getElementById("error");

// Trigger search on button click
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a book title or keyword.");
    return;
  }
  fetchBooks(query);
});

// Trigger search on Enter key press
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

// Show some books by default on page load
window.addEventListener("DOMContentLoaded", () => {
  fetchBooks("movie");
});

// Fetch books from Open Library
async function fetchBooks(query) {
  resultsContainer.innerHTML = "";
  errorContainer.classList.add("d-none");
  loadingIndicator.classList.remove("d-none");

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      resultsContainer.innerHTML = `<p class="text-center">No books found for "${query}".</p>`;
    } else {
      displayBooks(data.docs.slice(0, 12));
    }
  } catch (error) {
    errorContainer.textContent = `Error: ${error.message}`;
    errorContainer.classList.remove("d-none");
  } finally {
    loadingIndicator.classList.add("d-none");
  }
}

// Display books in Bootstrap cards
function displayBooks(books) {
  resultsContainer.innerHTML = "";

  books.forEach((book) => {
    const coverId = book.cover_i;
    const coverImage = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : "https://via.placeholder.com/150x220?text=No+Cover";

    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${coverImage}" class="card-img-top" alt="${book.title}" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text flex-grow-1">
            Author: ${book.author_name ? book.author_name.join(", ") : "Unknown"}
          </p>
          <p class="card-text"><small class="text-muted">First published: ${book.first_publish_year || "N/A"}</small></p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <a href="https://openlibrary.org${book.key}" target="_blank" class="btn btn-primary">View Book</a>
            <button class="btn btn-outline-danger btn-sm favorite-btn" data-id="${book.key}">❤️</button>
          </div>
        </div>
      </div>
    `;

    resultsContainer.appendChild(card);

    const favoriteBtn = card.querySelector(".favorite-btn");
    favoriteBtn.addEventListener("click", () => {
      toggleFavorite(book);
    });
  });
}

// Save or remove favorites in local storage
function toggleFavorite(book) {
  const key = book.key;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || {};

  if (favorites[key]) {
    delete favorites[key];
    alert("Removed from favorites!");
  } else {
    favorites[key] = {
      title: book.title,
      author: book.author_name ? book.author_name.join(", ") : "Unknown",
      coverId: book.cover_i,
      key: book.key
    };
    alert("Added to favorites!");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Dark Mode Toggle
const darkToggle = document.getElementById("darkModeToggle");

// Apply saved mode on load
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkToggle.checked = true;
  }
});

// Toggle dark mode on switch
darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
});
