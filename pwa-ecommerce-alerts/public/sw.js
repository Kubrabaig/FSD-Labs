self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Message Received.');

  let pushData = { 
    title: '⚡ Flash Deal!', 
    body: 'A new deal just dropped. Click to view.',
    image: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png'
  };

  if (event.data) {
    try {
      pushData = event.data.json();
    } catch (e) {
      pushData.body = event.data.text();
    }
  }

  const options = {
    body: pushData.body,
    icon: pushData.image,
    badge: 'https://cdn-icons-png.flaticon.com/512/1163/1163337.png',
    data: { url: 'http://localhost:5173' }
  };

  event.waitUntil(
    self.registration.showNotification(pushData.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});