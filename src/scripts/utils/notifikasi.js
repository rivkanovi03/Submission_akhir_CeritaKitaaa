import { urlBase64ToUint8Array } from '../index';
import { VAPID_PUBLIC_KEY } from '../config';
import { subsPushNotification, unsubsPushNotification } from '../data/api';

export function isNotificationSupported() {
  return 'Notification' in window;
}

export function hasNotificationPermission() {
  return Notification.permission === 'granted';
}

export async function askNotificationPermission() {
  if (!isNotificationSupported()) {
    console.warn('Browser tidak mendukung Notification API.');
    return false;
  }

  if (hasNotificationPermission()) return true;

  const permission = await Notification.requestPermission();

  if (permission === 'denied') {
    alert('Izin notifikasi ditolak oleh pengguna.');
    return false;
  }

  if (permission === 'default') {
    alert('Permintaan notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getActivePushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return registration?.pushManager.getSubscription() ?? null;
}

export async function hasActivePushSubscription() {
  const subscription = await getActivePushSubscription();
  return subscription !== null;
}

function buildSubscriptionOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export async function enablePushNotification() {
  const permissionGranted = await askNotificationPermission();
  if (!permissionGranted) return;

  const alreadySubscribed = await hasActivePushSubscription();
  if (alreadySubscribed) {
    alert('Push notification sudah diaktifkan sebelumnya.');
    return;
  }

  console.log('Memulai proses aktivasi push notification...');

  let subscription;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    subscription = await registration.pushManager.subscribe(buildSubscriptionOptions());

    const { endpoint, keys } = subscription.toJSON();
    const result = await subsPushNotification({ endpoint, keys });

    if (!result.ok) {
      console.error('Gagal menyimpan langganan ke server:', result);
      alert('Gagal mengaktifkan notifikasi.');
      await subscription.unsubscribe();
      return;
    }

    alert('Push notification berhasil diaktifkan.');
  } catch (err) {
    console.error('Terjadi kesalahan saat langganan:', err);
    alert('Tidak dapat mengaktifkan push notification.');
    if (subscription) await subscription.unsubscribe();
  }
}

export async function disablePushNotification() {
  try {
    const subscription = await getActivePushSubscription();

    if (!subscription) {
      alert('Belum ada langganan push notification yang aktif.');
      return;
    }

    const { endpoint } = subscription.toJSON();
    const result = await unsubsPushNotification({ endpoint });

    if (!result.ok) {
      console.error('Gagal menghapus langganan dari server:', result);
      alert('Gagal menonaktifkan notifikasi.');
      return;
    }

    const successfullyUnsubscribed = await subscription.unsubscribe();

    if (!successfullyUnsubscribed) {
      alert('Gagal berhenti langganan dari browser.');
      // rollback ke server jika gagal unsubscribe lokal
      const { keys } = subscription.toJSON();
      await subscribePushNotification({ endpoint, keys });
      return;
    }

    alert('Push notification berhasil dinonaktifkan.');
  } catch (err) {
    console.error('Kesalahan saat menonaktifkan push notification:', err);
    alert('Terjadi kesalahan saat menonaktifkan notifikasi.');
  }
}
