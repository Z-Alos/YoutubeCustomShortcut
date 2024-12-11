let currentIndex = -1;
let shortIndex = -1;
let selectableElements = [];
let insideShorts = false;
let shorts = [];
let currentUrl = location.href;
let homePageShortShelf = null;

// Selectors based on the context
const selectors = {
  searchPage: {
    parent: 'ytd-item-section-renderer',
    video: 'ytd-video-renderer',
    channel: 'ytd-channel-renderer',
    shortsShelf: 'ytd-reel-shelf-renderer',
    shorts: 'ytm-shorts-lockup-view-model-v2',
  },
  homePage: {
    parent: 'ytd-rich-grid-renderer',
    video: 'ytd-rich-item-renderer',
    shortsShelf: 'ytd-rich-section-renderer',
    shorts: 'ytm-shorts-lockup-view-model-v2',
  },
};

// Debounce function to limit the rate of function execution
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Function to determine the context dynamically
function getCurrentContext() {
  if (document.querySelector('ytd-item-section-renderer')) {
    return selectors.searchPage;
  } else if (document.querySelector('ytd-rich-grid-renderer')) {
    return selectors.homePage;
  } else {
    return null;
  }
}

// Function to highlight the current element
function highlightElement(index) {
  if (selectableElements.length === 0) return;

  // Remove existing highlights
  shorts.forEach((el) => el.classList.remove('currVideo'));
  selectableElements.forEach((el) => el.classList.remove('currVideo'));

  if(homePageShortShelf){
    homeShortShelf.classList.remove('currVideo');
    homePageShortShelf = null;
  }

  // Apply highlight to the current element
  let currentElement = insideShorts ? shorts[index] : selectableElements[index];

  if (currentElement) {
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if(currentElement.nodeName === "YTD-RICH-SECTION-RENDERER"){
      const homeShortShelf = currentElement.querySelector('#contents')
      homePageShortShelf = homeShortShelf;
      homeShortShelf.classList.add('currVideo');
    }else{
      currentElement.classList.add('currVideo');
    }
  }
}

// Function to update selectable elements
const updateSelectableElements = debounce(() => {
  selectableElements = []; // Reset the array
  const context = getCurrentContext();

  if (!context) {
    console.log('No valid context found.');
    return;
  }

  const firstParent = document.querySelectorAll(context.parent);

  firstParent.forEach((parent) => {
    parent.querySelector('#contents')?.childNodes.forEach((node) => {
      if (node.matches) {
        if (node.matches(context.video) || (context.channel && node.matches(context.channel))) {
          selectableElements.push(node);
          console.log("Pushed Video")
        } else if (node.matches(context.shortsShelf) || node.matches(context.shorts)) {
          selectableElements.push(node);
          console.log("Pushed Video")
        }
      }
    });
  });

}, 300);

// Function to reset state on page change
const resetState = debounce(() => {
  currentIndex = -1;
  shortIndex = -1;
  selectableElements = [];
  insideShorts = false;
  shorts = [];
  console.log('Page changed. Resetting state...');
  initializeGlideMode();
}, 300);

// Glide functions
function GlideUpThroughVideo() {
  console.log('I Pressed...');
  if (shortIndex <= 0) {
    insideShorts = false;
    shortIndex = -1;
    shorts = [];
  }
  if (insideShorts) {
    shortIndex--;
    highlightElement(shortIndex);
  } else {
    currentIndex = Math.max(currentIndex - 1, 0);
    highlightElement(currentIndex);
  }
}

function GlideDownThroughVideo() {
  console.log('K Pressed...');
  if (shortIndex === shorts.length - 1) {
    insideShorts = false;
    shortIndex = -1;
    shorts = [];
  }
  if (insideShorts) {
    shortIndex++;
    highlightElement(shortIndex);
  } else {
    currentIndex = Math.min(currentIndex + 1, selectableElements.length - 1);
    highlightElement(currentIndex);
  }
}

// Enter function
function enterVerdict() {
  console.log('Enter Key Pressed...');

  if (insideShorts) {
    shorts[shortIndex]?.querySelector('a')?.click();
  } 
  else if (selectableElements[currentIndex]) {
    const presentElement = selectableElements[currentIndex];
    if (presentElement.matches('ytd-reel-shelf-renderer, ytd-rich-section-renderer')) {
      insideShorts = true;
      shorts = presentElement.querySelectorAll('ytm-shorts-lockup-view-model');
    } else if(!window.location.href.includes('youtube.com/watch')) {
      presentElement.querySelector('a')?.click();
      console.log("worked;;;")
    }
  }
}

// Observer to watch for changes in the document body
const observer = new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    resetState();
    console.log("Page Reset... ", currentUrl)
  } else {
    updateSelectableElements();
  }
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // The page was loaded from cache
    console.log('Page loaded from cache. Reinitializing Glide Mode...');
    resetState();
  }
});

function initializeGlideMode() {
  console.log('Glide Mode Initialized...');
  updateSelectableElements();
  observer.observe(document.body, { childList: true, subtree: true });
}

// Make the Functions Globally Available
window.GlideUpThroughVideo = GlideUpThroughVideo;
window.GlideDownThroughVideo = GlideDownThroughVideo;
window.enterVerdict = enterVerdict;
window.initializeGlideMode = initializeGlideMode;

// Initialize on script load
initializeGlideMode();
