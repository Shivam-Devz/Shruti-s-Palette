let paintings = JSON.parse(localStorage.getItem('paintings')) || [
  { title: "Grace in Motion", image: "images/Grace.jpeg", description: "An ink sketch capturing the poise of Bharatanatyam in timeless elegance." },
  { title: "Wings of Bloom", image: "images/Bloom.jpeg", description: "A butterfly born of petals — where nature and imagination take flight together." },
  { title: "Echoes of Home", image: "images/Home.jpeg", description: "A quiet village scene painted in shades of memory and solitude." },
];

function renderGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  gallery.innerHTML = '';

  const isAdmin = sessionStorage.getItem("authorized") === "true";

  paintings.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'painting-card';
    let html = `
      <img src="${p.image}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${p.description || ''}</p>
    `;

    if (isAdmin) {
      html += `<button class="btn delete-btn" data-index="${index}">Delete</button>`;
    }

    card.innerHTML = html;
    gallery.appendChild(card);
  });

  // Delete functionality
  if (isAdmin) {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        if (confirm("Are you sure you want to delete this painting?")) {
          paintings.splice(idx, 1);
          localStorage.setItem('paintings', JSON.stringify(paintings));
          renderGallery();
        }
      });
    });
  }
}

renderGallery();

const paintingForm = document.getElementById('paintingForm');
if (paintingForm) {
  paintingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const file = document.getElementById('imageInput').files[0];

    if (!title || !file) return alert('Please enter title and select an image.');

    const reader = new FileReader();
    reader.onload = function () {
      paintings.push({ title, description, image: reader.result });
      localStorage.setItem('paintings', JSON.stringify(paintings));
      alert('Painting added successfully!');
      paintingForm.reset();
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
}
