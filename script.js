// Add Painting (on add.html)
const paintingForm = document.getElementById('paintingForm');
if (paintingForm) {
  paintingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const file = document.getElementById('imageInput').files[0];

    if (!title || !file) return alert('Please enter title and select an image.');

    try {
      const storageRef = storage.ref().child(`paintings/${Date.now()}_${file.name}`);
      await storageRef.put(file);
      const imageUrl = await storageRef.getDownloadURL();

      await db.collection('paintings').add({
        title,
        description,
        image: imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert('Painting added successfully!');
      paintingForm.reset();

    } catch (error) {
      console.error('Error uploading painting:', error);
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
      html += `<button class="btn delete-btn" data-id="${p.id}" data-image="${p.image}">Delete</button>`;
    }

    card.innerHTML = html;
    gallery.appendChild(card);
  });

  if (isAdmin) {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const paintingId = e.target.dataset.id;
        const imageUrl = e.target.dataset.image;

        if (!confirm("Are you sure you want to delete this painting?")) return;

        try {
          await db.collection('paintings').doc(paintingId).delete();
          const imageRef = storage.refFromURL(imageUrl);
          await imageRef.delete();
          loadGallery();
        } catch (error) {
          console.error('Error deleting painting:', error);
          alert('Failed to delete painting.');
        }
      });
    });
  }
}
