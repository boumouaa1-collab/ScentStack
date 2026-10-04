import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// ---- Splash loader ----
// The splash markup lives in index.html so it shows instantly. We keep it on screen
// for a short minimum (so it doesn't flash), wait for the web fonts (capped, so a slow
// font host can never block the site), then fade it out and unlock scrolling.
const SPLASH_MIN_MS = 1100;
const SPLASH_FONT_CAP_MS = 2500;

function hideSplash() {
  const splash = document.getElementById('splash');
  document.body.classList.remove('splash-active');
  if (!splash) return;
  splash.classList.add('splash-hide');
  window.setTimeout(() => splash.remove(), 700);
}

const fontsReady = document.fonts?.ready
  ? Promise.race([document.fonts.ready, new Promise((resolve) => window.setTimeout(resolve, SPLASH_FONT_CAP_MS))])
  : Promise.resolve();

fontsReady.then(() => {
  // performance.now() counts from the start of the page load, so slow connections add no extra wait.
  const elapsed = performance.now();
  window.setTimeout(hideSplash, Math.max(0, SPLASH_MIN_MS - elapsed));
});
