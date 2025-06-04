export default class FormInputHandler {
  #dataSource;

  constructor({ model }) {
    this.#dataSource = model;
  }

  async kirimData(formData) {
    try {
      const hasil = await this.#dataSource.kirimCeritaBaru(formData);
      alert("Data berhasil ditambahkan!");
      console.log("Respon server:", hasil);
    } catch (err) {
      alert("Gagal menambahkan data: " + err.message);
      console.error("Error saat submit:", err);
    }
  }
}
