import { useEffect } from "react";
import { useToasts } from 'react-toast-notifications';

export default function useServiceWorker(user) {
  const { addToast } = useToasts();

  useEffect(() => {
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: '8572a2d7-7dd8-4e83-a168-c646c40350d8',
    });

    beamsClient.start()
      .then(() => {
        beamsClient.addDeviceInterest('all');
        beamsClient.addDeviceInterest('user-type-' + user.userType);
        beamsClient.addDeviceInterest('group-' + user.group.id);
      })
      .then(() => console.log('Successfully registered and subscribed!'))
      .catch(console.error);
  }, []);
}
