async function registerServiceWorker() {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('sw.js');
      console.log('Service worker registered with scope:', registration.scope);
    } else {
      console.log('Service workers are not supported in this browser.');
    }
  } catch (error) {
    console.log('Service worker registration failed:', error);
  }
}

registerServiceWorker();
