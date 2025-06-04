import Data from "../../data/api.js";
import BerandaPresenter from "./BerandaPresenter.js";
import Database from '../../indexDB/IndexedDB.js';

export default class BerandaPage {
  #presenter;

  async render() {
    return `
      <style>
        .button-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .judul-section {
          text-align: center;
          color: #7e2553;
          margin: 40px 0 20px;
        }
        #btn-tambah {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        #btn-tambah:hover {
          background-color: #45a049;
        }
        #daftar-cerita {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 20px;
        }
        .cerita-item {
          background: #fff0f6;
          border: 2px solid #f8bbd0;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.2s ease;
        }
        .cerita-item:hover {
          box-shadow: 0 4px 8px rgba(122, 45, 105, 0.3);
        }
        .cerita-item img {
          width: 100%;
          border-radius: 6px;
          object-fit: cover;
          max-height: 180px;
          margin-bottom: 12px;
        }
        .cerita-item h3 {
          margin-bottom: 8px;
          color: #7e2553;
        }
        .cerita-item p {
          color: #5a2a57;
          font-size: 0.9rem;
          text-align: center;
        }
        /* Responsive */
        @media screen and (max-width: 900px) {
          #daftar-cerita {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media screen and (max-width: 600px) {
          #daftar-cerita {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <section class="container">
        <div id="loading-indicator"></div>
        <div class="button-wrapper">
          <button id="btn-tambah">Tambah Cerita</button>
        </div>
        <br/><br/>
        <h2 class="judul-section">Daftar Cerita</h2>
        <div id="daftar-cerita"></div>

        <h2 class="judul-section">Lokasi Cerita</h2>
        <div id="map" style="height: 400px; margin-top: 20px;"></div>
      </section>
    `;
  }

  showLoading() {
    document.getElementById("loading-indicator").innerHTML = `<p>Loading...</p>`;
  }

  hideLoading() {
    document.getElementById("loading-indicator").innerHTML = "";
  }

  async afterRender() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      window.location.href = "#/login";
      return; 
    }

    this.#presenter = new BerandaPresenter({
      model: Data,
      view: this,
      dbModel: Database,
    });

    await this.#presenter.ambilData();

    const tombolTambah = document.getElementById("btn-tambah");
    tombolTambah.addEventListener("click", () => {
      window.location.href = "#/tambah";
    });
  }

  tampilkanData(data) {
    const container = document.getElementById("daftar-cerita");

    const ceritaTerbatas = data.listStory.slice(0, 9); // Ambil 9 data pertama

    container.innerHTML = ceritaTerbatas
      .map(
        (item) => `
          <button class="cerita-item" data-id="${item.id}">
            <img src="${item.photoUrl}" alt="Gambar Cerita" />
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </button>
        `
      )
      .join("");

    document.querySelectorAll(".cerita-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (!document.startViewTransition) {
          window.location.href = `#/detail/${id}`;
          return;
        }

        document.startViewTransition(() => {
          window.location.href = `#/detail/${id}`;
        });
      });
    });

    // Reset Leaflet map jika sudah diinisialisasi
    const mapContainer = document.getElementById("map");
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const map = L.map("map").setView([-6.2, 106.816666], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    ceritaTerbatas.forEach((item) => {
      if (item.lat && item.lon) {
        L.marker([item.lat, item.lon])
          .addTo(map)
          .bindPopup(`<strong>${item.name}</strong><br>${item.description}`);
      }
    });
  }
}
