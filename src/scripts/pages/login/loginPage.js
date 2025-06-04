import loginHandler from "./loginHandler.js";
import Data from "../../data/api.js";

export default class LoginPage {
   async render() {
    return `
      <section class="login-section flex justify-center items-center min-h-screen bg-gray-100">
        <div class="login-wrapper bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <div id="loading-indicator" class="mb-4 text-center text-blue-500"></div>

          <h1 class="text-2xl font-semibold text-center mb-6">Masuk ke Akun Anda</h1>

          <form id="login-form" class="space-y-4">
            <div>
              <label for="user-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                id="user-email" 
                placeholder="Masukkan email" 
                required 
                class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label for="user-password" class="block text-sm font-medium text-gray-700">Kata Sandi</label>
              <input 
                type="password" 
                id="user-password" 
                placeholder="Masukkan kata sandi" 
                required 
                class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <button 
              type="submit"
              class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
            >
              Masuk
            </button>
          </form>

          <p class="mt-4 text-center text-sm text-gray-600">
            Belum punya akun? <a href="#/register" class="text-blue-600 hover:underline">Daftar</a>
          </p>
        </div>
      </section>
    `;
  }
  showLoading() {
    const loader = document.getElementById("loading-indicator");
    loader.innerHTML = ``;
  }

  hideLoading() {
    const loader = document.getElementById("loading-indicator");
    loader.innerHTML = "";
  }

  async afterRender() {
    const existingToken = sessionStorage.getItem("token");
    if (existingToken) {
      document.startViewTransition(() => {
        window.location.href = "#/";
      });
      return;
    }

    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("user-email").value.trim();
      const passwordInput = document.getElementById("user-password").value.trim();

      if (!emailInput || !passwordInput) {
        alert("Mohon isi email dan kata sandi.");
        return;
      }

      const loginProcessor = new loginHandler({ model: Data, view: this });
      await loginProcessor.processLogin({ email: emailInput, password: passwordInput });
    });
  }
}
