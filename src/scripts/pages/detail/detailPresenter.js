export default class detailPresenter {
  #dataId;
  #model;
  #view;

  constructor(dataId, { model, view }) {
    this.#dataId = dataId;
    this.#model = model;
    this.#view = view;
  }

  async getDataDetail() {
    try {
      const data = await this.#model.ambilCeritaBerdasarkanId(this.#dataId);
      this.#view.renderDetail(data);
    } catch (error) {
      throw error;
    }
  }
}
