let paintings = JSON.parse(localStorage.getItem("paintings")) || [
  {
    title: "Grace in Motion",
    image: "images/Grace.jpeg",
    description:
      "An ink sketch capturing the poise of Bharatanatyam in timeless elegance.",
  },
  {
    title: "Wings of Bloom",
    image: "images/Bloom.jpeg",
    description:
      "A butterfly born of petals — where nature and imagination take flight together.",
  },
  {
    title: "Echoes of Home",
    image: "images/Home.jpeg",
    description:
      "A quiet village scene painted in shades of memory and solitude.",
  },
  {
    title: "Saint of Shadows",
    image: "images/Saint.jpeg",
    description:
      "A dramatic portrait in deep graphite tones — wisdom, age, and artistry converge in expressive form.",
  },
  {
    title: "Blush of Hope",
    image: "images/Blush.jpeg",
    description:
      "A single pink bloom against shades of charcoal — symbolizing resilience, purity, and the beauty of simplicity.",
  },
  {
    title: "Still Life Harmony",
    image: "images/Still.jpeg",
    description:
      "A classic pencil still life of vases and fruits, reflecting patience, proportion, and perfect shading balance.",
  },
  {
    title: "Whispering Perch",
    image: "images/Perch.jpeg",
    description:
      "A delicate pencil sketch of a bird resting quietly on a branch — simplicity meeting serenity.",
  },
  {
    title: "Timeless Bloom",
    image: "images/Timeless.jpeg",
    description:
      "A classic graphite rose symbolizing love and resilience through soft strokes and sharp details.",
  },
  {
    title: "Breath of Reflection",
    image: "images/Breath.jpeg",
    description:
      "An expressive portrait sketch capturing the emotion of a woman lost in thought, blending grace and intensity.",
  },
  {
    title: "Unmasked Silence",
    image: "images/Silence.jpeg",
    description:
      "A stylized sketch of a girl veiled in mystery, portraying strength and hidden emotions.",
  },
  {
    title: "The Poet's Gaze",
    image: "images/Gaze.jpeg",
    description:
      "An elegant pencil portrait inspired by Rabindranath Tagore — wisdom etched through calm eyes.",
  },
  {
    title: "Harmony Within",
    image: "images/Harmony.jpeg",
    description:
      "An intricate mandala-inspired sketch representing inner peace and divine femininity.",
  },
  {
    title: "Divine Elegance",
    image: "images/Divine.jpeg",
    description:
      "A detailed ink composition blending tradition and artistry — the goddess-like figure radiates power and grace.",
  },
  {
    title: "Vase of Dreams",
    image: "images/Vase.jpeg",
    description:
      "A watercolor bouquet bursting with color and freshness, celebrating nature's simple beauty.",
  },
  {
    title: "Nature's Muse",
    image: "images/Muse.jpeg",
    description:
      "A surreal pencil creation intertwining a woman's face with leaves and branches — unity between humanity and nature.",
  },
];

function renderGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  const isAdmin = sessionStorage.getItem("authorized") === "true";

  paintings.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "painting-card";
    let html = `
      <img src="${p.image}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${p.description || ""}</p>
    `;

    if (isAdmin) {
      html += `<button class="btn delete-btn" data-index="${index}">Delete</button>`;
    }

    card.innerHTML = html;
    gallery.appendChild(card);
  });

  // Delete functionality
  if (isAdmin) {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        if (confirm("Are you sure you want to delete this painting?")) {
          paintings.splice(idx, 1);
          localStorage.setItem("paintings", JSON.stringify(paintings));
          renderGallery();
        }
      });
    });
  }
}

renderGallery();

const paintingForm = document.getElementById("paintingForm");
if (paintingForm) {
  paintingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const file = document.getElementById("imageInput").files[0];

    if (!title || !file)
      return alert("Please enter title and select an image.");

    const reader = new FileReader();
    reader.onload = function () {
      paintings.push({ title, description, image: reader.result });
      localStorage.setItem("paintings", JSON.stringify(paintings));
      alert("Painting added successfully!");
      paintingForm.reset();
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
}
