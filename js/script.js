async function loadItems() {
  try {
    const res = await fetch('https://techdominion-backend.onrender.com/api/items');
    const items = await res.json();

    const softwareList = document.getElementById('software-list');
    const courseList = document.getElementById('course-list');

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

window.addEventListener('DOMContentLoaded', loadItems);
