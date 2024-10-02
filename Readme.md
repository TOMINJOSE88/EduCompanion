EduCompanion

EduCompanion is a Chrome extension designed to enhance the online learning experience by providing essential tools like a distraction blocker, note-taking, and a timer. This extension helps students stay organized, block distracting websites, and track their study time efficiently.

Features

Distraction Blocker: Block websites that distract you while studying.
Note-Taking: Easily take and save notes directly within the extension.
Timer: Track study sessions with a built-in stopwatch.
To-Do List: Manage tasks with a simple and intuitive to-do list.
Resource Organizer: Save and tag useful resources for later use.


Installation
1. Clone this repository
2. Navigate to the extension folder
3. Open Chrome and go to chrome://extensions/.
4. Enable Developer Mode by toggling the switch in the top right corner.
5. Click Load unpacked and select the project folder (educompanion).
6. The EduCompanion extension is now installed and ready to use.

Usage

Distraction Blocker:

Click the Distraction Blocker button to open the blocker.
Add the URLs of distracting sites you wish to block.
Start or stop blocking with the Start Blocking and Stop Blocking buttons.

Note-Taking:

Open the Note Taking feature from the popup.
Write notes and click Save Note to store them.
Access saved notes anytime with the Saved Notes button.

Timer:

Open the Timer from the popup to start tracking your study time.
The stopwatch will continue running until you pause or reset it.

To-Do List:

Open the To-Do List from the popup.
Add tasks, mark them as done, or clear the entire list.

Resource Organizer:

Save useful resources with custom tags in the Resource Organizer.
View or clear saved resources later.

Dependencies:

This extension uses Chrome's declarativeNetRequest API for site blocking, as well as Chrome's storage API for saving user data (such as notes and blocked sites).

Required permissions:

storage: To store and retrieve blocked sites, notes, and timer state.
declarativeNetRequest: To block distracting websites.
tabs and activeTab: To interact with currently open tabs and block websites.

Docker Usage:

If you'd like to package the extension using Docker:

1. Build the Docker image   
2. and can modify the Dockerfile to build the project or package the extension for deployment.

Build the Docker Image
Before running the project, you need to build the Docker image. Run the following command from the project root directory:

docker build -t username/imagename .
docker run -d username/imagename

View running containers:
docker ps

View built Docker images:
docker images

