// Store unique sentences
let lastSentences = new Set();
let timer;

// Function to save unique content
function saveContent() {
  const jsname = document.querySelector('[jsname="tgaKEf"]');

  if (jsname) {
    // Clear the previous timer
    clearTimeout(timer);

    // Set a new timer to wait for stabilization
    timer = setTimeout(() => {
      // Get the current text content of the element
      const currentText = jsname.innerText || jsname.textContent;

      // Split the content into sentences
      const newSentences = currentText.split(/[.!?]/).map(sentence => sentence.trim()).filter(Boolean);

      // Retrieve existing content from chrome.storage.local
      chrome.storage.local.get(['transcript'], function(result) {
        let storedContent = result.transcript || '';

        // Append only new and unique sentences
        newSentences.forEach(sentence => {
          if (!lastSentences.has(sentence)) {
            storedContent += sentence + ". ";
            lastSentences.add(sentence);
          }
        });

        // Save the updated content back to chrome.storage.local
        chrome.storage.local.set({ transcript: storedContent });
      });
    }, 3000); // Adjust delay time as needed (1 second in this example)
  } else {
    console.log("Transcript element not found. Retrying...");
    setTimeout(startObserving, 500); // Retry every 500ms
  }
}

// Function to clear transcript on tab close
// function clearTranscript() {
//   chrome.storage.local.remove('transcript', function () {
//       if (chrome.runtime.lastError) {
//           console.error(chrome.runtime.lastError);
//       }
//   });
// }

// Function to start observing the element
function startObserving() {
  const jsname = document.querySelector('[jsname="tgaKEf"]');

  if (jsname) {
    const observer = new MutationObserver(saveContent);
    observer.observe(jsname, { childList: true, subtree: true, characterData: true });
  } else {
    console.log("Transcript element not found. Retrying...");
    setTimeout(startObserving, 500); // Retry every 500ms
  }
}

// Add event listener for tab close
// window.addEventListener('beforeunload', clearTranscript);

// Start observing the element
startObserving();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'checkCaptions') {
        const captionsElement = document.querySelector('[jsname="tgaKEf"]');
        sendResponse({ captionsEnabled: !!captionsElement });
    }
});
