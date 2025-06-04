export default class BerandaPresenter {
  #model;
  #view;
  #dbModel;

  constructor({ model, view, dbModel }) {
    this.#model = model;
    this.#view = view;
    this.#dbModel = dbModel;
  }

  async ambilData() {
  this.#view.showLoading();

  try {
    const data = await this.#model.ambilSemuaCerita();

    // Simpan ke IndexedDB sesuai format data
    if (data && Array.isArray(data.listStory)) {
      await Promise.all(data.listStory.map((story) => this.#dbModel.saveStory(story)));
    } else if (Array.isArray(data)) {
      await Promise.all(data.map((story) => this.#dbModel.saveStory(story)));
    }

    this.#view.tampilkanData(data);

  } catch (err) {
    console.warn("Gagal memuat data dari API. Mencoba mengambil dari IndexedDB...", err);

    try {
      const localData = await this.#dbModel.getAllStories();
      if (localData.length > 0) {
        this.#view.tampilkanData({ listStory: localData }); // bungkus agar sesuai format
      } else {
        alert("Tidak ada data lokal yang tersedia.");
      }
    } catch (dbErr) {
      console.error("Gagal mengambil data dari IndexedDB:", dbErr);
      alert("Gagal memuat data.");
    }
  }

  this.#view.hideLoading();
}

}
