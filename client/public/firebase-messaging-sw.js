importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCzwHMUK1pIfBk8TlDcjiN3yDmIy3sSOqc",
  authDomain: "weeklytennis.firebaseapp.com",
  projectId: "weeklytennis",
  storageBucket: "weeklytennis.firebasestorage.app",
  messagingSenderId: "874939629338",
  appId: "1:874939629338:web:63eb44ea4a42ea21b8f6a3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en background:', payload);

  const notificationTitle = payload.notification?.title || 'Nueva notificación';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logo192.png', // pon aquí el path a tu icono real
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});