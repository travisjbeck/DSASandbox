import { apiUrl } from './configuration';


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {



  if (request.action === 'checkLoginStatus') {
    // Make a request to your Next.js app's /api/auth/userinfo endpoint
    fetch(`${apiUrl}/api/session/user-info`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async response => {

        const data = await response.json();
        if (response.ok) {
          // User is logged in
          sendResponse({ isLoggedIn: true, user: data });
        } else {
          // User is not logged in
          sendResponse({ isLoggedIn: false });
        }
      })
      .catch(error => {
        console.error('Error checking login status:', error);
        sendResponse({ isLoggedIn: false });
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }

  if (request.action === "getCachedUser") {
    chrome.storage.local.get("user", (data) => {
      sendResponse(data.user);
    });
    return true; // Required to use sendResponse asynchronously
  }

  if (request.action === "storeUserDetails") {

    //convert the photoUrl to base64 if it exists
    if (request.user.photoUrl != '' && request.user.photoUrl != null && request.user.photoUrl != undefined) {
      fetch(request.user.photoUrl)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            request.user.photoData = base64data;
            chrome.storage.local.set({ user: request.user });
          }
        });
    } else {
      chrome.storage.local.set({ user: request.user });
    }
  }

  if (request.action === "destroyUserDetails") {
    chrome.storage.local.remove(["user"]);
  }

  if (request.action === 'cacheScreenshots') {
    const { url, desktopScreenshot, mobileScreenshot } = request;
    cacheScreenshots(url, desktopScreenshot, mobileScreenshot);
  }

  if (request.action === 'getCachedScreenshots') {
    const { url } = request;
    getScreenshots(url, sendResponse);
    return true; // Required to use sendResponse asynchronously
  }

  if (request.action === 'clearOtherCachedScreenshots') {
    const { url } = request;
    clearOtherScreenshots(url);
  }

});


function cacheScreenshots(url: string, desktopScreenshot: string, mobileScreenshot: string) {
  const screenshotKey = `screenshots_${url}`;
  chrome.storage.local.set({ [screenshotKey]: { desktopScreenshot, mobileScreenshot } });
}

function getScreenshots(url: string, sendResponse: (response: any) => void) {
  const screenshotKey = `screenshots_${url}`;
  chrome.storage.local.get(screenshotKey, (data) => {
    sendResponse(data[screenshotKey] || null);
  });
}

function clearOtherScreenshots(currentUrl: string) {
  chrome.storage.local.get(null, (data) => {
    const screenshotKeys = Object.keys(data).filter((key) => key.startsWith('screenshots_') && key !== `screenshots_${currentUrl}`);
    chrome.storage.local.remove(screenshotKeys);
  });
}