/**
 * Web Push Notification Handler for Instant Tzeva Adom Missile Alerts
 */

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support desktop notifications');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

export function getNotificationPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export function triggerEmergencyPushNotification(params: {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
}) {
  if (!('Notification' in window)) return null;

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(params.title, {
        body: params.body,
        icon: params.icon || '/favicon.ico',
        tag: params.tag || `tzeva-adom-${Date.now()}`,
        requireInteraction: true,
        silent: false,
      });

      // Vibrate mobile device if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([300, 150, 300, 150, 600]);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (e) {
      console.warn('Error displaying push notification:', e);
    }
  }
  return null;
}
