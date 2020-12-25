
importScripts("js/analytics-helper.js");

importScripts("js/sw-offline-google-analytics.js");
goog.offlineGoogleAnalytics.initialize();
var CACHE_DYNAMIC_NAME = "content-5";
//Change this value every time before you build
const LATEST_VERSION = "2.12";

//clean up old cache
self.addEventListener("activate", event => {
  var cacheKeeplist = CACHE_DYNAMIC_NAME;

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);
workbox.precaching.precacheAndRoute([
  "/index.html?v=" + LATEST_VERSION,
  "/css/basic.css?v=" + LATEST_VERSION,
  "/css/newcreation.css?v=" + LATEST_VERSION,
  "/css/styles.css?v=" + LATEST_VERSION,
  "/js/app.js?v=" + LATEST_VERSION,
  "/js/BookListView.js?v=" + LATEST_VERSION,
  "/js/ChapterView.js?v=" + LATEST_VERSION,
  "/js/HomeView.js?v=" + LATEST_VERSION,
  "/js/Language.js?v=" + LATEST_VERSION,
  "/js/PageView.js?v=" + LATEST_VERSION,
  "/js/Share.js?v=" + LATEST_VERSION,
  "/js/services/BibleService.js?v=" + LATEST_VERSION,
  "/js/services/DownloadService.js?v=" + LATEST_VERSION,
  "/js/services/PageService.js?v=" + LATEST_VERSION,
  "/lib/jszip.min.js?v=" + LATEST_VERSION,
  "/lib/lz-string.min.js?v=" + LATEST_VERSION
]);

workbox.routing.registerRoute(
  new RegExp(".*.js"),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  new RegExp(".*.css"),
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  /.*\.(?:html|htm|shtml|png|jpg|jpeg|svg|gif)/g,
  workbox.strategies.networkFirst({
    cacheName: CACHE_DYNAMIC_NAME
  })
);
