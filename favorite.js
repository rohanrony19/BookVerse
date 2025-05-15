const favoritesContainer = document.getElementById("favoritesContainer");
const emptyMessage = document.getElementById("emptyMessage");

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
  const books = Object.values(favorites);

  if (books.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";
  favoritesContainer.innerHTML = "";

  books.forEach((book) => {
    const coverImage = book.coverId
      ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
      : "https://via.placeholder.com/150x220?text=No+Cover";

    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${coverImage}" class="card-img-top" alt="${book.title}" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text flex-grow-1">Author: ${book.author}</p>
          <a href="https://openlibrary.org${book.key}" target="_blank" class="btn btn-primary mb-2">View Book</a>
          <button class="btn btn-outline-danger remove-btn">Remove</button>
        </div>
      </div>
    `;

    const removeBtn = card.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      removeFromFavorites(book.key);
    });

    favoritesContainer.appendChild(card);
  });
}

function removeFromFavorites(bookKey) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
  delete favorites[bookKey];
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

document.addEventListener("DOMContentLoaded", loadFavorites);
