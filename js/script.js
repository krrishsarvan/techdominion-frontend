function redirectToTelegram(productName) {
  const message = encodeURIComponent(`Hello sir, I am interested in "${productName}"`);
  window.open(`https://t.me/monarchrise?text=${message}`, '_blank');
}

// Live search
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.style.display = name.includes(filter) ? "block" : "none";
  });
});

// Load products from backend
async function loadItems() {
  try {
    const res = await fetch('/api/items');
    const items = await res.json();

    const softwareList = document.getElementById('software-list');
    const courseList = document.getElementById('course-list');

    // Clear existing
    softwareList.innerHTML = '';
    courseList.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.name = item.name;

      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="product-img">
        <h3>${item.name}</h3>
        <p class="price"><span class="original-price">${item.originalPrice}</span> ${item.price}</p>
        <p>${item.desc}</p>
        <button onclick="redirectToTelegram('${item.name}')">Buy Now</button>
      `;

      if (item.category === 'software') {
        softwareList.appendChild(card);
      } else if (item.category === 'courses') {
        courseList.appendChild(card);
      }
    });

  } catch (error) {
    console.error('❌ Failed to load items:', error);
  }
}

// Load items when page loads
window.addEventListener('DOMContentLoaded', loadItems);
