import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

// Module-scope guard so we only inject the script once
let tawkInjected = false;
let tawkReady = false;
const waitForTawk = (cb) => {
  if (tawkReady && window.Tawk_API) return cb();
  const iv = setInterval(() => {
    if (window.Tawk_API && window.Tawk_API.onLoad) {
      window.Tawk_API.onLoad = function(){ tawkReady = true; cb(); };
      clearInterval(iv);
    }
  }, 100);
};

const isDashboardRoute = (pathname) => pathname.startsWith('/dashboard') || pathname.startsWith('/agent');

export default function ChatWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const hasAttemptedInject = useRef(false);

  // One-time (lazy) script injection
  useEffect(() => {
    const propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID;
    const widgetId = import.meta.env.VITE_TAWK_WIDGET_ID;
    const requireConsent = (import.meta.env.VITE_TAWK_REQUIRE_CONSENT || 'false').toLowerCase() === 'true';
    const hasConsent = !requireConsent || localStorage.getItem('archsmart_consent') === 'true';

    if (!propertyId || !widgetId || propertyId === 'YOUR_PROPERTY_ID' || widgetId === 'YOUR_WIDGET_ID') {
      console.info('Tawk.to not configured: set VITE_TAWK_PROPERTY_ID and VITE_TAWK_WIDGET_ID');
      return;
    }
    if (tawkInjected || hasAttemptedInject.current) return; // already injected
    if (!hasConsent) return; // wait until consent is granted

    const inject = () => {
      if (tawkInjected) return;
      hasAttemptedInject.current = true;
      try {
        // Prevent duplicate if script element already exists
        const existing = document.querySelector(`script[src*="embed.tawk.to/${propertyId}/${widgetId}"]`);
        if (existing) { tawkInjected = true; return; }

        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();
        const s1 = document.createElement('script');
        const s0 = document.getElementsByTagName('script')[0];
        s1.async = true;
        s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1, s0);
        tawkInjected = true;
      } catch (e) {
        console.warn('Failed to inject Tawk script', e);
      }
    };

    // Lazy load after small delay or first interaction
    const timeout = setTimeout(inject, 5000);
    const onFirstInteraction = () => { inject(); cleanup(); };
    const cleanup = () => {
      document.removeEventListener('scroll', onFirstInteraction);
      document.removeEventListener('mousemove', onFirstInteraction);
      document.removeEventListener('keydown', onFirstInteraction);
      clearTimeout(timeout);
    };
    document.addEventListener('scroll', onFirstInteraction, { once: true });
    document.addEventListener('mousemove', onFirstInteraction, { once: true });
    document.addEventListener('keydown', onFirstInteraction, { once: true });

    return () => cleanup();
  }, []);

  // Update attributes and visibility when user/route changes
  useEffect(() => {
    // Hide widget on admin/agent dashboards; show elsewhere
    waitForTawk(() => {
      try {
        if (isDashboardRoute(location.pathname)) {
          window.Tawk_API.hideWidget();
        } else {
          window.Tawk_API.showWidget();
        }
      } catch {}

      try {
        if (user) {
          window.Tawk_API.setAttributes({
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            id: user.id,
          }, () => {});
          // Add tags for segmentation
          if (window.Tawk_API.addTags) {
            window.Tawk_API.addTags([ 'logged-in', user.role || 'user' ]);
          }
        } else {
          if (window.Tawk_API.addTags) {
            window.Tawk_API.addTags([ 'guest' ]);
          }
        }
      } catch {}

      // Page view event
      try {
        window.Tawk_API.addEvent && window.Tawk_API.addEvent('page-view', {
          page: location.pathname,
          timestamp: new Date().toISOString(),
        });
        if (location.pathname.startsWith('/properties/')) {
          const propertyId = location.pathname.split('/').pop();
          window.Tawk_API.addEvent('property-view', {
            property_id: propertyId,
            timestamp: new Date().toISOString(),
          });
        }
      } catch {}
    });
  }, [user, location.pathname]);

  // Do NOT remove script on unmount (load-once behavior). Just return null.
  return null;
}
