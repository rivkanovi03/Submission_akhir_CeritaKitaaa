export default class loginHandler {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async processLogin(credentials) {
    try {
      this.#view.showLoading();

      const response = await this.#model.loginPengguna(credentials);
      sessionStorage.setItem("token", response.loginResult.token);
      window.location.href = "#/";
      window.location.reload();
    } catch (error) {
      alert("Failed login: Incorrect Email or Password");
      window.location.reload();
    }
  }
}
