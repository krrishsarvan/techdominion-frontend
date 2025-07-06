async function loadItems() {
  try {
    const res = await fetch('https://techdominion-backend.onrender.com/api/items');
    const items = await res.json();

    const softwareList = document.getElementById('software-list');
    const courseList = document.getElementById('course-list');

    if (softwareList) softwareList.innerHTML = '';
    if (courseList) courseList.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.title = item.title;

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="product-img">
        <h3>${item.title}</h3>
        <p class="price">
          <span class="original-price">₹${item.originalPrice}</span> ₹${item.discountedPrice}
        </p>
        <p>${item.description}</p>
        <button onclick="window.open('${item.link}', '_blank')">Buy Now</button>
      `;

      if (item.category === 'software' && softwareList) {
        softwareList.appendChild(card);
      } else if (item.category === 'courses' && courseList) {
        courseList.appendChild(card);
      }
    });
  } catch (error) {
    console.error('❌ Failed to load items:', error);
  }
}

window.addEventListener('DOMContentLoaded', loadItems);
