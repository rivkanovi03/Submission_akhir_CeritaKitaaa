import Data from "../../data/api.js";
import FormInputHandler from "./FormInputHandler.js";

export default class FormInputPage {
 async render() {
  return `
    <style>
      .auth-section {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
      }

      .auth-wrapper {
        width: 100%;
        max-width: 600px;
        background: #fff0f6;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .auth-wrapper h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #7e2553;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      label {
        font-weight: bold;
        color: #5a2a57;
        margin-top: 0.5rem;
      }

      textarea {
        resize: vertical;
        min-height: 100px;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
      }

      input[type="file"] {
        border: none;
      }

      button {
        background-color: #7e2553;
        color: white;
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover {
        background-color: #5a2a57;
      }

      video, canvas {
        width: 100%;
        border-radius: 8px;
      }

      #map {
        border-radius: 8px;
      }

      #location-coordinates {
        text-align: center;
        color: #444;
        font-size: 0.95rem;
        margin-bottom: 1rem;
      }

      @media screen and (max-width: 600px) {
        .auth-wrapper {
          padding: 1rem;
        }
      }
    </style>

    <section class="auth-section">
      <div class="auth-wrapper">
        <h1>Form Tambah Data</h1>
        <form id="form-tambah">
          <label for="description">Deskripsi:</label>
          <textarea id="description" placeholder="Tulis deskripsi..." required></textarea>

          <button type="button" id="btn-kamera">Gunakan Kamera</button>
          <video id="video-stream" autoplay style="display: none; margin-top: 1rem;"></video>
          <button type="button" id="btn-capture" style="display: none;">Ambil Gambar</button>
          <canvas id="snapshot-canvas" style="display: none;"></canvas>

          <label for="image-upload">Atau unggah gambar dari perangkat:</label>
          <input type="file" id="image-upload" accept="image/*" />

          <p style="font-size: 0.9rem; color: gray;">Pilih salah satu metode: kamera atau upload</p>

          <label for="map">Tentukan Lokasi:</label>
          <div id="map" style="height: 300px;"></div>
          <p id="location-coordinates">Klik pada peta untuk memilih lokasi</p>

          <button type="submit">Simpan Data</button>
        </form>
      </div>
    </section>
  `;
}


  async afterRender() {
    const videoEl = document.getElementById("video-stream");
    const canvasEl = document.getElementById("snapshot-canvas");
    const ctx = canvasEl.getContext("2d");
    const kameraBtn = document.getElementById("btn-kamera");
    const captureBtn = document.getElementById("btn-capture");
    const uploadInput = document.getElementById("image-upload");
    let cameraStream = null;
    let fotoDariKamera = null;

    const aktifkanKamera = async () => {
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoEl.srcObject = cameraStream;
        videoEl.style.display = "block";
        captureBtn.style.display = "inline-block";
        kameraBtn.textContent = "Matikan Kamera";
      } catch (err) {
        alert("Tidak bisa mengakses kamera: " + err.message);
      }
    };

    const matikanKamera = () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
      }
      videoEl.style.display = "none";
      captureBtn.style.display = "none";
      kameraBtn.textContent = "Gunakan Kamera";
      fotoDariKamera = null;
    };

    kameraBtn.addEventListener("click", () => {
      if (videoEl.style.display === "none") {
        aktifkanKamera();
      } else {
        matikanKamera();
      }
    });

    captureBtn.addEventListener("click", async () => {
      if (!cameraStream) {
        alert("Kamera belum diaktifkan!");
        return;
      }

      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;
      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

      fotoDariKamera = await new Promise(resolve => {
        canvasEl.toBlob(resolve, "image/jpeg");
      });

      alert("Gambar berhasil diambil.");
    });

    const map = L.map("map").setView([-7.797068, 110.370529], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    let latitude = null, longitude = null;
    let currentMarker = null;
    const koordinatEl = document.getElementById("location-coordinates");

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      latitude = lat;
      longitude = lng;

      if (currentMarker) map.removeLayer(currentMarker);
      currentMarker = L.marker([lat, lng]).addTo(map);

      koordinatEl.textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    });

    const formEl = document.getElementById("form-tambah");
    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();

      const deskripsi = document.getElementById("description").value.trim();
      if (!deskripsi) {
        alert("Deskripsi tidak boleh kosong!");
        return;
      }

      if (latitude === null || longitude === null) {
        alert("Tentukan lokasi terlebih dahulu pada peta.");
        return;
      }

      let foto = null;
      const pakaiKamera = videoEl.style.display === "block";

      if (pakaiKamera && fotoDariKamera) {
        foto = fotoDariKamera;
      } else if (uploadInput.files.length > 0) {
        foto = uploadInput.files[0];
      }

      if (!foto) {
        alert("Harap unggah atau ambil gambar terlebih dahulu.");
        return;
      }

      const payload = new FormData();
      payload.append("description", deskripsi);
      payload.append("photo", foto, "image.jpg");
      payload.append("lat", latitude);
      payload.append("lon", longitude);

      const handler = new FormInputHandler({ model: Data });
      await handler.kirimData(payload);

      matikanKamera();
      window.location.href = "/";
    });

    window.addEventListener("popstate", matikanKamera);
    window.addEventListener("hashchange", matikanKamera);
  }
}
