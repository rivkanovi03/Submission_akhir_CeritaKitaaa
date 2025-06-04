import detailPresenter from "./detailPresenter.js";
import Data from "../../data/api.js";

export default class DetailPage {
  #presenter;

  async render() {
  return `
    <style>
      .detail-section {
        max-width: 800px;
        margin: 2rem auto;
        font-family: Arial, sans-serif;
        padding: 1rem;
      }
      #detail-container {
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        padding: 1.5rem;
      }
      .btn-back {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        margin-bottom: 1rem;
      }
      .btn-back:hover {
        background: #0056b3;
      }
      .loading-text {
        font-style: italic;
        color: #666;
      }
      .error-text {
        color: red;
      }
      .detail-title {
        margin-top: 0;
        color: #222;
      }
      .detail-description {
        line-height: 1.5;
        color: #444;
      }
      .detail-image {
        max-width: 100%;
        border-radius: 6px;
        margin: 1rem 0;
      }
      .detail-id {
        font-size: 0.8rem;
        color: #888;
      }
      #map-container {
        margin-top: 1rem;
        border-radius: 6px;
        overflow: hidden;
      }
    </style>

    <section class="detail-section">
      <div id="detail-container">
        <div id="loading-indicator"></div>

        <button id="back-button" class="btn-back">← Kembali</button>

        <div id="detail-content"></div>

        <div id="map-container" style="height: 400px;"></div>
      </div>
    </section>
  `;
}


  showLoading() {
    const loadingEl = document.getElementById("loading-indicator");
    if (loadingEl) {
      loadingEl.innerHTML = `<p class="loading-text">Memuat data...</p>`;
    }
  }

  hideLoading() {
    const loadingEl = document.getElementById("loading-indicator");
    if (loadingEl) {
      loadingEl.innerHTML = "";
    }
  }

  getIdFromHash() {
    const hash = location.hash || "";
    const segments = hash.slice(1).split("/");
    if (segments.length >= 3 && segments[1] === "detail") {
      return segments[2];
    }
    return null;
  }

  async afterRender() {
    const backBtn = document.getElementById("back-button");
    backBtn.addEventListener("click", () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          window.location.hash = "#/";
        });
      } else {
        window.location.hash = "#/";
      }
    });

    const id = this.getIdFromHash();

    this.#presenter = new detailPresenter(id, {
      model: Data,
      view: this,
    });

    this.showLoading();
    try {
      await this.#presenter.getDataDetail();
    } catch (error) {
      console.error("Gagal mengambil detail:", error);
      const detailContent = document.getElementById("detail-content");
      detailContent.innerHTML = `<p class="error-text">Tidak dapat memuat data detail.</p>`;
    } finally {
      this.hideLoading();
    }
  }

  renderDetail(data) {
    const container = document.getElementById("detail-content");
    if (!container) return;

    container.innerHTML = `
      <h2 class="detail-title">${data.story.name}</h2>
      <p class="detail-description">${data.story.description}</p>
      <img class="detail-image" src="${data.story.photoUrl}" alt="Gambar ${data.story.name}" />
    `;

    const lat = data.story.lat;
    const lon = data.story.lon;

    if (lat && lon) {
      const mapContainer = document.getElementById("map-container");
      mapContainer.innerHTML = "";

      const map = L.map("map-container").setView([lat, lon], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<strong>${data.story.name}</strong><br>Lokasi: ${lat.toFixed(5)}, ${lon.toFixed(5)}`)
        .openPopup();
    }
  }
}
