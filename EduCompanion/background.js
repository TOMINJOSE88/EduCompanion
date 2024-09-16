chrome.runtime.onInstalled.addListener(() => {
    console.log("EduCompanion Extension Installed");
  });

  let isRunning = false;
  let minutes = 0;
  let seconds = 0;
  let timer = null;
  
  // Function to start the timer
  function startTimer() {
      if (!timer) {
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
                  timerRunning: true
              });
  
              // Send an update to any popup that might be open
              chrome.runtime.sendMessage({
                  action: 'updateTimer',
                  minutes: minutes,
                  seconds: seconds
              });
          }, 1000);
      }
  }
  
  // Function to stop the timer
  function stopTimer() {
      if (timer) {
          clearInterval(timer);
          timer = null;
  
          chrome.storage.local.set({
              timerRunning: false
          });
      }
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'startTimer') {
          startTimer();
          sendResponse({ status: 'timer started' });
      } else if (message.action === 'stopTimer') {
          stopTimer();
          sendResponse({ status: 'timer stopped' });
      } else if (message.action === 'resetTimer') {
          stopTimer();
          minutes = 0;
          seconds = 0;
          chrome.storage.local.set({
              timerMinutes: minutes,
              timerSeconds: seconds,
              timerRunning: false
          });
          sendResponse({ status: 'timer reset' });
      } else if (message.action === 'getTimerState') {
          sendResponse({
              minutes: minutes,
              seconds: seconds,
              isRunning: isRunning
          });
      }
  });
  