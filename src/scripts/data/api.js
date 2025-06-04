import CONFIG from "../config";

const API_ENDPOINT = {
  FETCH_STORIES: `${CONFIG.BASE_URL}/stories`,
  LOGIN_USER: `${CONFIG.BASE_URL}/login`,
  REGISTER_USER: `${CONFIG.BASE_URL}/register`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/unsubscribe`,
};

const getAuthToken = () => sessionStorage.getItem("token");

const Data = {
  async ambilSemuaCerita() {
    const response = await fetch(API_ENDPOINT.FETCH_STORIES, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal memuat data (${response.status})`);
    }

    return await response.json();
  },

  async ambilCeritaBerdasarkanId(id) {
    const response = await fetch(`${API_ENDPOINT.FETCH_STORIES}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data dengan ID ${id} (${response.status})`);
    }

    return await response.json();
  },

  async kirimCeritaBaru(formData) {
    const response = await fetch(API_ENDPOINT.FETCH_STORIES, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`Gagal mengirim cerita (${response.status}): ${errorMsg}`);
    }

    return await response.json();
  },

  async loginPengguna({ email, password }) {
    const response = await fetch(API_ENDPOINT.LOGIN_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Login gagal (${response.status}): ${errMsg}`);
    }

    return await response.json();
  },

  async daftarPenggunaBaru({ name, email, password }) {
    const response = await fetch(API_ENDPOINT.REGISTER_USER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Registrasi gagal (${response.status}): ${errMsg}`);
    }

    return await response.json();
  },

  async subsPushNotification({ endpoint, keys: { p256dh, auth } }) {
    const response = await fetch(API_ENDPOINT.SUBSCRIBE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ endpoint, keys: { p256dh, auth } }),
    });

    if (!response.ok) {
      throw new Error(`Gagal berlangganan notifikasi: ${response.statusText}`);
    }

    const json = await response.json();
    return { ...json, ok: response.ok };
  },

  async unsubsPushNotification({ endpoint }) {
    const response = await fetch(API_ENDPOINT.UNSUBSCRIBE, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ endpoint }),
    });

    if (!response.ok) {
      throw new Error(`Gagal berhenti berlangganan notifikasi: ${response.statusText}`);
    }

    const json = await response.json();
    return { ...json, ok: response.ok };
  },
};
export const subsPushNotification = Data.subsPushNotification;
export const unsubsPushNotification = Data.unsubsPushNotification;

export default Data;

