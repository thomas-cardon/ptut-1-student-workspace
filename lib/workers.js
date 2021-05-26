import { useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';

export default function useServiceWorker(user) {
  const { addToast } = useToasts();

  useEffect(async () => {
    if (!user?.isLoggedIn) return;

    try {
      const beamsClient = new PusherPushNotifications.Client({
        instanceId: '8572a2d7-7dd8-4e83-a168-c646c40350d8',
      });
  
      await beamsClient.start();
      beamsClient.addDeviceInterest('all');
      beamsClient.addDeviceInterest('user-type-' + user.userType);
      beamsClient.addDeviceInterest('group-' + user.group.id);
    }
    catch(error) {
      console.error(error);
    }

    return () => {
      beamsClient.stop()
      .then(() => console.log('Beams SDK has been stopped'))
      .catch(e => console.error('Could not stop Beams SDK', e));
    };
  }, [user]);
}
