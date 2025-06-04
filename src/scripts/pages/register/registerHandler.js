export default class SignUpPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async processSignUp(userData) {
    try {
      this.#view.showLoading();

      const response = await this.#model.daftarPenggunaBaru(userData);
      alert("Registration successful! Please login.");
      window.location.href = "#/login";
    } catch (error) {
      console.error("Failed to register:", error.message);
      alert("Registration failed. the email you entered is already registered");
    } finally {
      this.#view.hideLoading();
    }
  }
}
