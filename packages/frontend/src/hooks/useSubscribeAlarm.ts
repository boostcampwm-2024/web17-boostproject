import { usePostInitAlarm } from '@/apis/queries/alarm';

export const useSubscribeAlarm = () => {
  const { mutate: postInitAlarm } = usePostInitAlarm();

  const subscribeAlarm = async () => {
    if ('Notification' in window && navigator.serviceWorker) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
              import.meta.env.VITE_VAPID_PUBLIC_KEY,
            ),
          });

          postInitAlarm(subscription);
        }
      } catch (error) {
        console.log('Subscription failed', error);
      }
    }
  };

  return { subscribeAlarm };
};

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};
