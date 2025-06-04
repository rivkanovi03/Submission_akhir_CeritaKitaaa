import routes from "../routes/routes";
import {
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate,
} from '../templates';
import { isServiceWorkerAvailable } from '../utils';
import {
  hasActivePushSubscription,
  enablePushNotification ,
  disablePushNotification ,
} from '../utils/notifikasi';

class App {
  #mainContent;
  #btnDrawer;
  #navDrawer;

  constructor({ content, drawerButton, navigationDrawer }) {
    this.#mainContent = content;
    this.#btnDrawer = drawerButton;
    this.#navDrawer = navigationDrawer;

    this.#initializeDrawer();
  }

  #initializeDrawer() {
    this.#btnDrawer.addEventListener("click", () => {
      this.#navDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      const clickedInsideDrawer = this.#navDrawer.contains(event.target);
      const clickedDrawerButton = this.#btnDrawer.contains(event.target);

      if (!clickedInsideDrawer && !clickedDrawerButton) {
        this.#navDrawer.classList.remove("open");
      }

      this.#navDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navDrawer.classList.remove("open");
        }
      });
    });
  }

 async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await hasActivePushSubscription();
    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        disablePushNotification ().finally(() => {
          this.#setupPushNotification();
        });
      });
      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      enablePushNotification ().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    let currentPath = location.hash.slice(1) || "/";

    // Handling dynamic routes like /detail/123
    if (currentPath.startsWith("/detail/")) {
      currentPath = "/detail/:id";
    }

    const authToken = sessionStorage.getItem("token");
    const openRoutes = ["/login", "/register", "/about"];

    if (!authToken && !openRoutes.includes(currentPath)) {
      window.location.hash = "#/login";
      return;
    }

    if (authToken && (currentPath === "/login" || currentPath === "/register")) {
      window.location.hash = "#/";
      return;
    }

    const routePage = routes[currentPath];

    if (!routePage) {
      this.#mainContent.innerHTML = `<h2 style="text-align:center;">404 - Halaman tidak ditemukan</h2>`;
      return;
    }

    try {
      this.#mainContent.innerHTML = await routePage.render();
      if (typeof routePage.afterRender === "function") {
        await routePage.afterRender();
      }
    } catch (err) {
      console.error("Error saat memuat halaman:", err);
      this.#mainContent.innerHTML = `<p>Maaf, terjadi kesalahan saat memuat halaman.</p>`;
    }
     if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
  }
  
}

export default App;
