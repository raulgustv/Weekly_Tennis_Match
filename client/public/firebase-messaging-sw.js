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

// 👇 ESTO ES LO QUE TE FALTA

// Maneja notificaciones cuando la app está en background/cerrada
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification?.title || "Weekly Tennis";
  const notificationOptions = {
    body: payload.data?.body || "",
    icon: "/tenis-logo.png", // opcional, pon el que tengas
    data: {
      url: payload.data?.url || "https://weekly-tennis-match.vercel.app/games"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Maneja el clic en la notificación (esto es lo que te está fallando)
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "https://weekly-tennis-match.vercel.app/games";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});