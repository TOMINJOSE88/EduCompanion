window.onload = function() {
    // Timer elements
    var timerModal = document.getElementById("timerModal");
    var openTimerModalBtn = document.getElementById("openTimerModal");
    var closeTimerModalBtn = document.getElementById("closeTimerModal");
    var timerDisplay = document.getElementById("timerDisplay");
    var startStopBtn = document.getElementById("startStopBtn");
    var resetBtn = document.getElementById("resetBtn");

    let isRunning = false;
    let minutes = 0;
    let seconds = 0;

    // Load the saved timer state from the background script when the popup is opened
    chrome.runtime.sendMessage({ action: 'getTimerState' }, function(response) {
        minutes = response.minutes || 0;
        seconds = response.seconds || 0;
        isRunning = response.isRunning || false;

        updateDisplay();

        if (isRunning) {
            startStopBtn.textContent = "Pause";
            timerDisplay.classList.add('red-indicator'); // Show red indicator when running
        } else {
            startStopBtn.textContent = "Start";
            timerDisplay.classList.remove('red-indicator'); // Remove red indicator when paused
        }
    });


    // Get the elements
        var popup = document.getElementById('resource-organizer-popup');
        var saveBtn = document.getElementById('save-resource-btn');
        var closeBtn = document.querySelector('.close-btn');

        // Function to get the active tab's URL
        function getCurrentTabUrl(callback) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var activeTab = tabs[0];
                var activeTabUrl = activeTab.url;
                callback(activeTabUrl);
            });
        }

        // When the user clicks on the "Save Resource" button
        saveBtn.onclick = function() {
            // Capture the tag from the input field
            var resourceTag = document.getElementById('resource-tag').value;

            // Get the current tab URL
            getCurrentTabUrl(function(url) {
                // Create a resource object with the URL and tag
                var resource = {
                    tag: resourceTag,
                    url: url
                };

                // Save the resource to Chrome storage
                chrome.storage.sync.get({resources: []}, function(result) {
                    var resources = result.resources;
                    resources.push(resource);  // Add new resource to the array
                    chrome.storage.sync.set({resources: resources}, function() {
                        console.log('Resource saved successfully!');
                    });
                });
            });

            // Close the popup after saving
            popup.style.display = 'none';
        };

        // Open the popup when the button is clicked
        document.getElementById('resource-organizer-btn').onclick = function() {
            popup.style.display = 'block';
        };

        // Close the popup when the close button is clicked
        closeBtn.onclick = function() {
            popup.style.display = 'none';
        };

        // Optionally close the popup when clicking outside of it
        window.onclick = function(event) {
            if (event.target == popup) {
                popup.style.display = 'none';
            }
        }

        // Get elements for saving and displaying resources
var saveBtn = document.getElementById('save-resource-btn');
var viewSavedResourcesBtn = document.getElementById('view-saved-resources-btn');
var closeSavedResourcesBtn = document.querySelector('.close-saved-resources-btn');
var savedResourcesPopup = document.getElementById('saved-resources-container');
var resourceList = document.getElementById('resource-list');
var clearAllBtn = document.getElementById('clear-all-btn');

// Function to get the current tab URL
function getCurrentTabUrl(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        var activeTabUrl = activeTab.url;
        callback(activeTabUrl);
    });
}

// Save the URL and tag when the user clicks "Save Resource"
saveBtn.onclick = function() {
    var resourceTag = document.getElementById('resource-tag').value;
    getCurrentTabUrl(function(url) {
        var resource = {
            tag: resourceTag,
            url: url
        };

        // Save the resource to Chrome storage
        chrome.storage.sync.get({resources: []}, function(result) {
            var resources = result.resources;
            resources.push(resource);
            chrome.storage.sync.set({resources: resources}, function() {
                console.log('Resource saved successfully!');
            });
        });
    });

    // Optionally close the popup after saving
    document.getElementById('resource-organizer-popup').style.display = 'none';
};

// Display saved resources when "Saved Resources" button is clicked
viewSavedResourcesBtn.onclick = function() {
    // Retrieve saved resources from Chrome storage
    chrome.storage.sync.get({resources: []}, function(result) {
        var resources = result.resources;
        resourceList.innerHTML = '';  // Clear the previous list

        if (resources.length > 0) {
            // Loop through each resource and create a list item with an "X" delete button
            resources.forEach(function(resource, index) {
                var resourceDiv = document.createElement('div');
                resourceDiv.className = 'resource-item';
                resourceDiv.innerHTML = `
                    <p><strong>Tag:</strong> ${resource.tag}</p>
                    <a href="${resource.url}" target="_blank">${resource.url}</a>
                    <button class="delete-btn" data-index="${index}">&times;</button> <!-- "X" button -->
                `;
                resourceList.appendChild(resourceDiv);
            });

            // Attach delete button event listeners
            var deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    var index = this.getAttribute('data-index');
                    deleteResource(index); // Call function to delete the resource
                });
            });

        } else {
            resourceList.innerHTML = '<p>No resources saved yet.</p>';
        }
    });

    // Show the popup with saved resources
    savedResourcesPopup.style.display = 'block';
};


// Delete a specific resource
function deleteResource(index) {
    chrome.storage.sync.get({resources: []}, function(result) {
        var resources = result.resources;
        resources.splice(index, 1); // Remove the resource by index
        chrome.storage.sync.set({resources: resources}, function() {
            console.log('Resource deleted!');
            viewSavedResourcesBtn.click(); // Refresh the list of saved resources
        });
    });
}

// Clear all resources when "Clear All" button is clicked
clearAllBtn.onclick = function() {
    chrome.storage.sync.set({resources: []}, function() {
        console.log('All resources cleared!');
        resourceList.innerHTML = '<p>No resources saved yet.</p>';
    });
};

// Close the saved resources popup when close button is clicked
closeSavedResourcesBtn.onclick = function() {
    savedResourcesPopup.style.display = 'none';
};



    // Open Timer modal
    openTimerModalBtn.onclick = function() {
        timerModal.style.display = "block";
    };

    // Close Timer modal
    closeTimerModalBtn.onclick = function() {
        timerModal.style.display = "none";
    };

    // Start or stop the timer
    startStopBtn.onclick = function() {
        if (!isRunning) {
            chrome.runtime.sendMessage({ action: 'startTimer' }, function(response) {
                console.log(response.status);
            });
            startStopBtn.textContent = "Pause";
            timerDisplay.classList.add('red-indicator'); // Show red indicator when running
        } else {
            chrome.runtime.sendMessage({ action: 'stopTimer' }, function(response) {
                console.log(response.status);
            });
            startStopBtn.textContent = "Start";
            timerDisplay.classList.remove('red-indicator'); // Remove red indicator when paused
        }
        isRunning = !isRunning;
    };

    // Reset the timer
    resetBtn.onclick = function() {
        chrome.runtime.sendMessage({ action: 'resetTimer' }, function(response) {
            console.log(response.status);
            minutes = 0;
            seconds = 0;
            updateDisplay();
            startStopBtn.textContent = "Start";
            timerDisplay.classList.remove('red-indicator'); // Remove red indicator when reset
        });
    };

    // Function to update the display with the timer state
    function updateDisplay() {
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Listen for updates from the background script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === 'updateTimer') {
            minutes = message.minutes;
            seconds = message.seconds;
            updateDisplay();
        }
    });

    // ----------------------------------------
    // Note-Taking Feature
    var modal = document.getElementById("noteModal");
    var openModalBtn = document.getElementById("openModal");
    var closeModalBtn = document.getElementById("closeModal");
    var showSavedNotesBtn = document.getElementById("showSavedNotes");
    var savedNotesContainer = document.getElementById("savedNotesContainer");
    var clearAllNotesBtn = document.getElementById("clearAllNotes");

    // Display saved notes from local storage on load
    displaySavedNotes();

    // Open the modal for note taking
    if (openModalBtn) {
        openModalBtn.onclick = function() {
            modal.style.display = "block";
        };
    }

    // Close the modal when user clicks the close button (x)
    if (closeModalBtn) {
        closeModalBtn.onclick = function() {
            modal.style.display = "none";
        };
    }

    // Save the note when user clicks the "Save Note" button
    document.getElementById("saveNote").onclick = function() {
        var noteContent = document.getElementById("noteText").value;

        if (noteContent.trim() !== "") {
            saveNoteToLocalStorage(noteContent);
            displaySavedNotes(); // Update the list of saved notes
            document.getElementById("noteText").value = ""; // Clear the textarea
            modal.style.display = "none"; // Close the modal
        } else {
            alert("Please enter a note before saving.");
        }
    };

    // Show saved notes when "Saved Notes" button is clicked
    if (showSavedNotesBtn) {
        showSavedNotesBtn.onclick = function() {
            savedNotesContainer.style.display = "block"; // Show the saved notes section
            displaySavedNotes(); // Display the notes
        };
    }

    // Clear all saved notes
    if (clearAllNotesBtn) {
        clearAllNotesBtn.onclick = function() {
            chrome.storage.local.set({ notes: [] }, function() {
                displaySavedNotes(); // Refresh the notes display after clearing
                alert("All notes have been cleared.");
            });
        };
    }

    // Function to save note to Chrome's local storage
    function saveNoteToLocalStorage(note) {
        chrome.storage.local.get({ notes: [] }, function(result) {
            var notes = result.notes;
            notes.push(note);
            chrome.storage.local.set({ notes: notes });
        });
    }

    // Function to display saved notes with delete functionality
    function displaySavedNotes() {
        chrome.storage.local.get({ notes: [] }, function(result) {
            var notes = result.notes;
            var savedNotesList = document.getElementById("savedNotesList");
            savedNotesList.innerHTML = ""; // Clear the list before displaying

            if (notes.length > 0) {
                notes.forEach(function(note, index) {
                    // Create list item for each note
                    var noteItem = document.createElement("li");
                    noteItem.textContent = note;

                    // Create delete button
                    var deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "X"; // Delete button text
                    deleteBtn.classList.add("delete-btn");

                    // Add event listener to delete the note when clicked
                    deleteBtn.onclick = function() {
                        deleteNoteFromLocalStorage(index);
                    };

                    // Append the note and delete button to the list item
                    noteItem.appendChild(deleteBtn);
                    savedNotesList.appendChild(noteItem);
                });
            } else {
                savedNotesList.innerHTML = "<li>No saved notes yet.</li>";
            }
        });
    }

    // Function to delete note from local storage
    function deleteNoteFromLocalStorage(noteIndex) {
        chrome.storage.local.get({ notes: [] }, function(result) {
            var notes = result.notes;
            notes.splice(noteIndex, 1); // Remove the note at the given index
            chrome.storage.local.set({ notes: notes }, function() {
                displaySavedNotes(); // Refresh the displayed notes
            });
        });
    }
};
