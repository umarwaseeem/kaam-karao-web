/**
 * Google Identity Services wrapper.
 * Requires the GIS script loaded in index.html:
 *   <script async src="https://accounts.google.com/gsi/client"></script>
 */
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

export function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.id) {
      reject(new Error('Google Identity Services not loaded.'));
      return;
    }
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => {
        if (response.credential) {
          resolve({ idToken: response.credential });
        } else {
          reject(new Error('No credential returned from Google.'));
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: render the button flow via a hidden div trick
        reject(new Error('Google sign-in was dismissed or unavailable.'));
      }
    });
  });
}

export function renderGoogleButton(elementId, options = {}) {
  if (!window.google?.accounts?.id) return;
  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: options.callback,
    auto_select: false,
  });
  window.google.accounts.id.renderButton(document.getElementById(elementId), {
    theme: 'outline',
    size: 'large',
    text: options.text ?? 'signin_with',
    shape: 'rectangular',
    width: options.width ?? 320,
    ...options.buttonConfig,
  });
}
