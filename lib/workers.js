import { useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';

export default function useServiceWorker(user) {
  const { addToast } = useToasts();

  useEffect(async () => {
    if (!user?.isLoggedIn) return;

    const beamsClient = new PusherPushNotifications.Client({
      instanceId: '8572a2d7-7dd8-4e83-a168-c646c40350d8',
    });

    try {
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

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      const wb = window.workbox
      // add event listeners to handle any of PWA lifecycle event
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
      wb.addEventListener('installed', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener('controlling', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener('activated', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = event => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        if (confirm("Une nouvelle version de l'application web est disponible. Voulez-vous recharger?")) {
          wb.addEventListener('controlling', event => {
            window.location.reload()
          })

          // Send a message to the waiting service worker, instructing it to activate.
          wb.messageSkipWaiting()
        } else console.log('User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.');
      }

      wb.addEventListener('waiting', promptNewVersionAvailable)

      // ISSUE - this is not working as expected, why?
      // I could only make message event listenser work when I manually add this listenser into sw.js file
      wb.addEventListener('message', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      /*
      wb.addEventListener('redundant', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      wb.addEventListener('externalinstalled', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      wb.addEventListener('externalactivated', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      */

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();
    }
  }, []);
}
