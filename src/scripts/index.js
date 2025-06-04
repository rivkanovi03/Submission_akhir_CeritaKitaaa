import "../styles/styles.css";
import App from "./pages/app";
import { registerServiceWorker } from './utils';
import {BASE_URL} from './config';
import Database from './indexDB/IndexedDB';

const { saveStory, getAllStories, deleteStory } = Database;


document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await registerServiceWorker();
  await requestNotificationPermission();

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});

async function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notifikasi diizinkan');
    } else {
      console.log('Notifikasi ditolak');
    }
  } else {
    console.log('Notifikasi sudah diizinkan');
  }
}



export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function fetchAndCacheStories() {
  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/stories');
    const data = await response.json();
    // simpan ke IndexedDB
    data.stories.forEach(story => saveStory(story));
    renderStories(data.stories);
  } catch (error) {
    console.log('Fetch API gagal, coba ambil dari IndexedDB', error);
    const cachedStories = await getAllStories();
    console.log('Data cachedStories dari IndexedDB:', cachedStories);
    if (cachedStories.length > 0) {
      renderStories(cachedStories);
    } else {
      const listElement = document.getElementById('daftar-cerita');
      if(listElement) {
        listElement.innerHTML = '<p>Data tidak tersedia offline</p>';
      } else {
        console.error('Elemen #stories-list tidak ditemukan di DOM');
      }
    }
  }
}


function renderStories(stories) {
  const listElement = document.getElementById('daftar-cerita'); 
  if (!listElement) {
    console.error('Elemen dengan id "cerita-item" tidak ditemukan');
    return;
  }

  listElement.innerHTML = '';

  stories.forEach((story) => {
    const item = document.createElement('div');
    item.innerHTML = `
      <h3>${story.title || story.name}</h3>
      <p>${story.content || story.description}</p>
      <button onclick="hapusStory('${story.id}')">Hapus</button>
    `;
    listElement.appendChild(item);
  });
}


async function hapusStory(id) {
  await deleteStory(id);
  fetchAndCacheStories(); // Refresh tampilan setelah hapus
}




