const BASE_URL = location.protocol + '//' + location.host;
self.addEventListener("install", () => console.log("Services >> Service de notifications installé 🤙"));

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray;
}

// saveSubscription saves the subscription to the backend
const saveSubscription = async subscription => {
  const SERVER_URL = BASE_URL + '/api/notifications/subscribe';

  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription }),
  });

  return response.json();
}

self.addEventListener('activate', async () => {
  // This will be called only once when the service worker is activated.
  try {
    const applicationServerKey = urlB64ToUint8Array('BFSDAPvCd3KoMuYnxHSSw7QofBJ6-hDq-2Yyq-UfaYyy47k4g4loSPqimLirh1bnPR1wdpZGB03ye5M0Yy1FBtM');

    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);

    await saveSubscription(subscription);
  } catch (error) {
    console.error(error);
  }
});

self.addEventListener('push', function(event) {
  if (event.data) {
    let d = event.data.text().split('|');
    console.log('Push >>', d);
    showLocalNotification(d[0] || 'Informations', d[1], self.registration);
  }
  else console.log('Push >> No data');
});

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    icon: BASE_URL + '/favicon.ico',
    lang: navigator.language || navigator.userLanguage,
    body,
    timestamp: new Date()
  };

  swRegistration.showNotification(title, options);
}
