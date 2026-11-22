import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const isNative = Capacitor.isNativePlatform();

/**
 * Initializes native mobile environment (StatusBar, Hardware Back Button, etc.)
 */
export const initNativeApp = (navigate) => {
  if (!isNative) return;

  // 1. Configure Status Bar
  try {
    StatusBar.setStyle({ style: Style.Light });
    StatusBar.setBackgroundColor({ color: '#FAF6F2' });
    StatusBar.setOverlaysWebView({ overlay: false });
  } catch (err) {
    console.debug('StatusBar configuration error:', err);
  }

  // 2. Hardware Back Button Listener on Android
  try {
    App.addListener('backButton', ({ canGoBack }) => {
      // Check if any modal or drawer is open
      const openModal = document.querySelector('[data-mobile-modal="open"]');
      if (openModal) {
        const closeBtn = openModal.querySelector('[data-modal-close]');
        if (closeBtn) {
          closeBtn.click();
          return;
        }
      }

      if (window.location.pathname === '/' || !canGoBack) {
        // At root or cannot go back
        App.exitApp();
      } else {
        if (navigate) {
          navigate(-1);
        } else {
          window.history.back();
        }
      }
    });
  } catch (err) {
    console.debug('BackButton setup error:', err);
  }
};

/**
 * Trigger subtle haptic tactile feedback on touch devices
 */
export const triggerHaptic = async (style = ImpactStyle.Light) => {
  if (!isNative) return;
  try {
    await Haptics.impact({ style });
  } catch (e) {
    // Ignore error if device does not support haptics
  }
};

