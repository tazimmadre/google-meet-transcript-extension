document.addEventListener('DOMContentLoaded', function () {
    const transcriptContent = document.getElementById('transcriptContent');
    const noTranscriptMessage = document.getElementById('noTranscriptMessage');
    const clearTranscriptButton = document.getElementById('clearTranscriptButton');
    const warningMessage = document.getElementById('warningMessage');

    // Function to check if captions are enabled
    function checkCaptionsEnabled() {
        // Send a message to the content script to check for the captions element
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'checkCaptions' }, function(response) {
                if (response && response.captionsEnabled) {
                    warningMessage.style.display = 'none'; // Hide the warning if captions are enabled
                } else {
                    warningMessage.style.display = 'block'; // Show the warning if captions are not enabled
                }
            });
        });
    }

    // Retrieve transcript from storage
    chrome.storage.local.get(['transcript'], function (result) {
        if (document.body) {
            const transcript = result.transcript || '';

            if (transcript) {
                noTranscriptMessage.style.display = 'none'; // Hide the message
                transcriptContent.innerHTML = transcript.replace(/\n/g, '<br>'); // Show transcript with line breaks
            } else {
                noTranscriptMessage.style.display = 'block'; // Show no transcript message
            }
        }
    });

    // Clear the transcript on button click
    clearTranscriptButton.addEventListener('click', function () {
        if (document.body) { // Check if the popup is still open
            chrome.storage.local.remove('transcript', function () {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    transcriptContent.innerHTML = ''; // Clear displayed transcript
                    noTranscriptMessage.style.display = 'block'; // Show no transcript message
                }
            });
        }
    });

    // Check captions status when the popup is opened
    checkCaptionsEnabled();
});
