let isBlocking = false;
let blockedSites = [];
let isRunning = false;
let minutes = 0;
let seconds = 0;
let timer = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("EduCompanion Extension Installed");
});

// Consolidated onMessage listener for blocking and timer functionality
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startBlocking") {
    // Retrieve the blocked sites from Chrome's storage
    chrome.storage.sync.get({ blockedSites: [] }, function (result) {
      blockedSites = result.blockedSites;
      isBlocking = true;
      updateBlockingRules(sendResponse); // Pass the response callback
    });
    return true; // Indicates the response will be sent asynchronously
  } else if (message.action === "stopBlocking") {
    isBlocking = false;
    removeAllRules(sendResponse); // Force removal of all rules
    return true; // Indicates the response will be sent asynchronously
  } else if (message.action === "startTimer") {
    startTimer();
    sendResponse({ status: "timer started" });
  } else if (message.action === "stopTimer") {
    stopTimer();
    sendResponse({ status: "timer stopped" });
  } else if (message.action === "resetTimer") {
    stopTimer();
    minutes = 0;
    seconds = 0;
    chrome.storage.local.set({
      timerMinutes: minutes,
      timerSeconds: seconds,
      timerRunning: false,
    });
    sendResponse({ status: "timer reset" });
  } else if (message.action === "getTimerState") {
    sendResponse({
      minutes: minutes,
      seconds: seconds,
      isRunning: isRunning,
    });
  }
});

// Update blocking rules based on whether blocking is active or not
function updateBlockingRules(sendResponse) {
  const ruleIds = blockedSites.map((_, index) => index + 1); // Generate rule IDs

  if (isBlocking && blockedSites.length > 0) {
    const rules = blockedSites.map((site, index) => ({
      id: index + 1, // Unique ID for each rule
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: site, resourceTypes: ["main_frame"] }, // Block only main page requests
    }));

    // Add blocking rules dynamically
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        addRules: rules, // Add new rules
        removeRuleIds: [], // No removal here because we're adding
      },
      () => {
        console.log("Blocking rules updated.");
        sendResponse({ status: "blocking started" });
      }
    );
  }
}

// Function to remove all dynamic rules
function removeAllRules(sendResponse) {
  console.log("Attempting to remove all dynamic rules.");

  // Use chrome.declarativeNetRequest.getDynamicRules to list all existing rules
  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    const ruleIdsToRemove = existingRules.map((rule) => rule.id); // Get all existing rule IDs

    // Remove all dynamic rules by passing all existing rule IDs
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        addRules: [], // No new rules
        removeRuleIds: ruleIdsToRemove, // Remove all existing rules
      },
      () => {
        console.log("All dynamic rules removed.");
        sendResponse({ status: "blocking stopped, all rules removed" });
      }
    );
  });
}

// Timer Functions
function startTimer() {
  if (!timer) {
    isRunning = true; // Set isRunning when the timer starts
    timer = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }

      // Save the current timer state to chrome storage
      chrome.storage.local.set({
        timerMinutes: minutes,
        timerSeconds: seconds,
        timerRunning: true,
      });

      // Send an update to any popup that might be open
      chrome.runtime.sendMessage({
        action: "updateTimer",
        minutes: minutes,
        seconds: seconds,
      });
    }, 1000);
  }
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    isRunning = false; // Set isRunning when the timer stops
    chrome.storage.local.set({
      timerRunning: false,
    });
  }
}
