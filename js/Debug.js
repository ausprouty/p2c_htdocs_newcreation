async function storageEstimate() {
  // Pro-tip: The Cache Storage API is available outside of service workers!
  // See https://googlechrome.github.io/samples/service-worker/window-caches/
  //const cache = await caches.open('data-cache');
  //await cache.add(dataUrl);
  var line = "\n";
  var locstorage = "";
  var locstorage2 = "";
  for (var i = 0, len = localStorage.length; i < len; i++) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    if (!key.includes("bible") && !key.includes("epubjs")) {
      console.log(key + " => " + value);
      locstorage2 = locstorage + key + " => " + value + line;
      locstorage = locstorage2;
    }
  }

  const { usage, quota } = await storageEstimateWrapper();
  const percentUsed = Math.round((usage / quota) * 100);
  const usageInMib = Math.round(usage / (1024 * 1024));
  const quotaInMib = Math.round(quota / (1024 * 1024));
  var storage = `${usageInMib} out of ${quotaInMib} MiB used (${percentUsed}%)`;
  const local_count = localStorage.length;
  var items = ` ${local_count} items in local storage`;
  // https://www.fastly.com/blog/clearing-cache-browser
  await fetch("files/opening.html", {
    headers: { "Forced-Revalidate": 1 },
    credentials: "include"
  });
  await fetch("files/opening.html", { method: "POST", credentials: "include" });
  // variables

  document.querySelector("#storageEstimate").innerText = storage;
  document.querySelector("#items").innerText = items;
  document.querySelector("#local_storage").innerText = locstorage;
  document.querySelector("#operating_system").innerText = navigator.platform;
  if (window.localStorage.getItem("debugMode")) {
    document.querySelector("#mode").innerText = "Debug Mode";
  } else {
    document.querySelector("#mode").innerText = "Standard Mode";
  }
}

// see https://developers.google.com/web/updates/2017/08/estimating-available-storage-space

async function storageEstimateWrapper() {
  // best option
  if ("storage" in navigator && "estimate" in navigator.storage) {
    // We've got the real thing! Return its response.
    console.log("using storage estimate method");
    return navigator.storage.estimate();
  }
  //second best
  if (
    "webkitTemporaryStorage" in navigator &&
    "queryUsageAndQuota" in navigator.webkitTemporaryStorage
  ) {
    // Return a promise-based wrapper that will follow the expected interface.
    console.log("using webkitTemporaryStorage method");
    return new Promise(function(resolve, reject) {
      navigator.webkitTemporaryStorage.queryUsageAndQuota(function(
        usage,
        quota
      ) {
        resolve({ usage: usage, quota: quota });
      },
      reject);
    });
  }

  // If we can't estimate the values, return a Promise that resolves with NaN.
  return Promise.resolve({ usage: NaN, quota: NaN });
}

function toggleMode() {
  if (!window.localStorage.getItem("debugMode")) {
    window.localStorage.setItem("debugMode", "TRUE");
    document.querySelector("#mode").innerText = "Debug Mode";
  } else {
    localStorage.removeItem("debugMode");
    document.querySelector("#mode").innerText = "Standard Mode";
  }
}

function listCache(){
  var stored = '';
  var temp = '';
  window.caches.keys().then(function (cacheNames) {
    cacheNames.forEach(function (cacheName) {
      window.caches
        .open(cacheName)
        .then(function (cache) {
          return cache.keys();
        })
        .then(function (requests) {
          requests.forEach(function (request) {
           //temp = stored + '<p><a href ="' + request.url + '">';
           //stored = temp + request.url +  '</a></p>'+ "\n";
           temp = stored + request.url + "\n";
           stored = temp;
            return;
          });
          console.log (stored);
          document.getElementById("cache").innerText = stored;
        });
    });
  });
}
