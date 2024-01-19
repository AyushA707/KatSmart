
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

/*      COMMAND      */
/*import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
*/


/* eslint-disable no-restricted-globals */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

const isLocalhost = Boolean(
  self.location.hostname === 'localhost' ||
    self.location.hostname === '[::1]' ||
    self.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

precacheAndRoute(self.__WB_MANIFEST);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in self.navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, self.location.href);
    if (publicUrl.origin !== self.location.origin) {
      return;
    }

    self.addEventListener('install', (event) => {
      const preCache = async () => {
        const cache = await caches.open('my-app-cache');
        await cache.addAll(self.__WB_MANIFEST);
        self.skipWaiting();
      };

      event.waitUntil(preCache());
    });

    self.addEventListener('activate', (event) => {
      const cleanUp = async () => {
        const cacheKeys = await caches.keys();
        const oldCaches = cacheKeys.filter((key) => key !== 'my-app-cache');
        await Promise.all(oldCaches.map((key) => caches.delete(key)));
        self.clients.claim();
      };

      event.waitUntil(cleanUp());
    });

    // CacheFirst strategy for static assets
    registerRoute(
      /\.(js|css|html|png|jpg|jpeg|gif|svg|ico)$/,
      new CacheFirst({
        cacheName: 'static-assets-cache',
      })
    );

    // Handle fetch for dynamic content
    self.addEventListener('fetch', (event) => {
      const handleFetch = async () => {
        const cache = await caches.open('my-app-cache');
        const cachedResponse = await cache.match(event.request);
        return cachedResponse || fetch(event.request);
      };

      event.respondWith(handleFetch());
    });
  }
}

// ... (rest of the code remains the same)

/* eslint-enable no-restricted-globals */


function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            console.log(
              'New content is available and will be used when all ' +
                'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
            );

            if (config && config.onUpdate) {
              config.onUpdate(registration);
            }
          } else {
            console.log('Content is cached for offline use.');
            if (config && config.onSuccess) {
              config.onSuccess(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

/* eslint-enable no-restricted-globals */