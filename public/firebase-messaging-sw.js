// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your Firebase config (same as frontend)
const firebaseConfig = {
  apiKey: "AIzaSyB-OpVQBq72SeL6muPVZAPVNEz7vzu6blQ",
  authDomain: "mechanicpro-2fec0.firebaseapp.com",
  projectId: "mechanicpro-2fec0",
  storageBucket: "mechanicpro-2fec0.firebasestorage.app",
  messagingSenderId: "385213888167",
  appId: "1:385213888167:web:56fcdefe7a1dc1620dcd82",
  measurementId: "G-G802CY6BHW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'MechanicPro';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/logo.png',
    badge: '/logo.png',
    data: payload.data,
    tag: payload.data?.type || 'general'
  };

  console.log('Showing background notification:', notificationTitle);
  
  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();
  
  const urlToOpen = new URL('/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if app is already open
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if app not open
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Service worker installation
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
});