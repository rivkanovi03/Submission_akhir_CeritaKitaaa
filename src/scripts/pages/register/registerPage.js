import SignUpPresenter from "./registerHandler.js";
import Data from "../../data/api.js";

export default class RegisterPage {
  async render() {
    return `
      <section class="registration-section">
        <div class="register-wrapper">
          <div id="spinner-container"></div>
          <h1>Daftar Akun</h1>
          <br />
          <form id="register-form">
            <label for="full-name">Nama Lengkap:</label>
            <input type="text" id="full-name" placeholder="Nama lengkap" required />

            <label for="reg-email">Email:</label>
            <input type="email" id="reg-email" placeholder="Alamat email" required />

            <label for="reg-password">Kata Sandi:</label>
            <input type="password" id="reg-password" placeholder="Kata sandi" required />

            <button type="submit">Daftar</button>
          </form>

          <p>Sudah punya akun? <a href="#/login">Masuk</a></p>
        </div>
      </section>
    `;
  }

  showLoading() {
    const spinner = document.getElementById("spinner-container");
    spinner.innerHTML = ``;
  }

  hideLoading() {
    const spinner = document.getElementById("spinner-container");
    spinner.innerHTML = "";
  }

  async afterRender() {
    const formElement = document.getElementById("register-form");

    formElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("full-name").value.trim();
      const emailInput = document.getElementById("reg-email").value.trim();
      const passwordInput = document.getElementById("reg-password").value.trim();

      if (!nameInput || !emailInput || !passwordInput) {
        alert("Semua kolom wajib diisi!");
        return;
      }

      const signUpHandler = new SignUpPresenter({ model: Data, view: this });
      await signUpHandler.processSignUp({
        name: nameInput,
        email: emailInput,
        password: passwordInput,
      });
    });
  }
}
