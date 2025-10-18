// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB-OpVQBq72SeL6muPVZAPVNEz7vzu6blQ",
  authDomain: "mechanicpro-2fec0.firebaseapp.com",
  projectId: "mechanicpro-2fec0",
  storageBucket: "mechanicpro-2fec0.firebasestorage.app",
  messagingSenderId: "385213888167",
  appId: "1:385213888167:web:56fcdefe7a1dc1620dcd82",
  measurementId: "G-G802CY6BHW"
};

// Your VAPID key
export const vapidKey = "BAxDi7MdlhkohpsuOceWRG9-ol4RuPOEeTVBqBqIEDDgf2JKfOh9a3dhjs34oxjj5i1eQfFw6T7x6S9ByCel1Qk";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Enhanced FCM permission function with service worker registration
export const requestFCMPermission = async () => {
  try {
    // Check if FCM is supported
    const isFcmSupported = await isSupported();
    if (!isFcmSupported) {
      console.log('FCM not supported in this browser');
      return null;
    }

    // Register service worker first
    let serviceWorkerRegistration;
    if ('serviceWorker' in navigator) {
      try {
        serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        console.log('✅ Service Worker registered:', serviceWorkerRegistration);
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
        return null;
      }
    }

    const messaging = getMessaging(app);

    // Request notification permission
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      const token = await getToken(messaging, { 
        vapidKey: vapidKey,
        serviceWorkerRegistration: serviceWorkerRegistration
      });
      
      if (token) {
        console.log('✅ FCM token obtained:', token);
        return token;
      } else {
        console.log('❌ No FCM token available');
        return null;
      }
    } else {
      console.log('❌ Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
};

// Enhanced foreground message handler
export const onForegroundMessage = (callback) => {
  return onMessage(getMessaging(app), (payload) => {
    console.log('📨 Foreground FCM message received:', payload);
    
    // Show browser notification even in foreground
    if (payload.notification && Notification.permission === 'granted') {
      const { title, body } = payload.notification;
      new Notification(title || 'MechanicPro', {
        body: body,
        icon: '/logo.png',
        badge: '/logo.png'
      });
    }
    
    // Call the provided callback
    if (callback) {
      callback(payload);
    }
  });
};

// Utility function to get messaging instance
export const getMessagingInstance = () => {
  return getMessaging(app);
};

// Check if service worker is ready
export const isServiceWorkerReady = async () => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    return !!registration;
  } catch (error) {
    return false;
  }
};

export { app };