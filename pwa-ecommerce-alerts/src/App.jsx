import { useState, useEffect } from 'react';

function App() {
  const [permission, setPermission] = useState(Notification.permission);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    }
  };

  const requestNotificationPermission = async () => {
    const status = await Notification.requestPermission();
    setPermission(status);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛍️ PWA Deal Alerts</h1>

      {deferredPrompt && (
        <button onClick={installApp}>Install App</button>
      )}

      <p>Permission: {permission}</p>

      {permission !== 'granted' && (
        <button onClick={requestNotificationPermission}>
          Enable Notifications
        </button>
      )}
    </div>
  );
}

export default App;