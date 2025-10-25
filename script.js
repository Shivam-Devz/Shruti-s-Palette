// Add Painting (on add.html)
const paintingForm = document.getElementById('paintingForm');
if (paintingForm) {
  paintingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const imageUrl = document.getElementById('imageInput').value.trim();

    if (!title || !imageUrl) return alert('Please enter title and image URL.');

    try {
      await db.collection('paintings').add({
        title,
        description,
        image: imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert('Painting added successfully!');
      paintingForm.reset();

    } catch (error) {
      console.error('Error adding painting:', error);
      alert('Failed to add painting.');
    }
  });
}

// Load Gallery (on gallery.html)
const gallery = document.getElementById('gallery');
if (gallery) {
  loadGallery();
}

async function loadGallery() {
  const isAdmin = sessionStorage.getItem("authorized") === "true";
  const snapshot = await db.collection('paintings').orderBy('createdAt', 'desc').get();
  const paintings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  gallery.innerHTML = '';

  paintings.forEach(p => {
    const card = document.createElement('div');
    card.className = 'painting-card';
    let html = `
      <img src="${p.image}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${p.description || ''}</p>
    `;

    if (isAdmin) {
      html += `<button class="btn delete-btn" data-id="${p.id}">Delete</button>`;
    }

    card.innerHTML = html;
    gallery.appendChild(card);
  });

  // Delete functionality
  if (isAdmin) {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const paintingId = e.target.dataset.id;

        if (!confirm("Are you sure you want to delete this painting?")) return;

        try {
          await db.collection('paintings').doc(paintingId).delete();
          loadGallery();
        } catch (error) {
          console.error('Error deleting painting:', error);
          alert('Failed to delete painting.');
        }
      });
    });
  }
}
