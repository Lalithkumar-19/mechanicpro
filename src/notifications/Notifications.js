import { requestFCMPermission, onForegroundMessage } from '../firebase';
import { toast } from 'react-toastify';

// Store FCM token in a module-level variable
let fcmToken = null;

export const setupFCM = async () => {
    try {
        onForegroundMessage((payload) => {
            console.log('Foreground message received:', payload);
            if (payload.notification) {
                toast.info(payload.notification.body, {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        });
    } catch (error) {
        console.error('Error setting up FCM:', error);
    }
};

export const requestNotificationPermission = async () => {
    try {
        const token = await requestFCMPermission();
        if (token) {
            fcmToken = token;  // Store token in module variable
            console.log('FCM Token:', token);
            
            // Show toast in the component where this function is called, not here
            return token;
        }
        return null;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return null;
    }
};

export const getFcmToken = () =>{ return fcmToken};

export const sendTokenToBackend = async (token, userToken, type) => {
    try {
        const response = await fetch("http://localhost:3000/api/fcm-token",{//'https://mechpro-backend.vercel.app/api/fcm-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user_token')}`
            },
            body: JSON.stringify({
                fcmToken: token,
                userId: userToken,
                userType: type 
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send token to backend');
        }
        
        console.log('Token sent to backend');
        return true;
    } catch (error) {
        console.error('Failed to send token to backend:', error);
        return false;
    }
};