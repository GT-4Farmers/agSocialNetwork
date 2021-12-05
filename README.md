# Haystack Version 1.0

A social media platform for agricultural professionals to promote collaboration and connectivity.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Release Notes

## New Software Features

Register and create a new user Profile on Haystack
Search for other users, view their profiles, and send friend requests
Create posts on their profiles and attach media to those posts
View a custom Home screen that shows posts from all of the user’s friends
Browse and participate in forum discussions by means of creating their own discussions as well as replying to discussions other users have created
Adjust simple privacy settings such as updating login credentials and making the user account private and consequently unsearchable by users that are not already friends with the user.

## Bug Fixes

User with null data can create a user profile
Friends list is not alphabetized
Picture upload size is not limited
Profile doesn’t refresh after creating a new post with image attached
Posting/Commenting Input does not acknowledge the character limit set in the SQL table
If a user likes a different user’s post, the like indicator is not green when viewing the post on the other user’s profile
While typing a comment, all comment input fields on the page are updated

## Known Bugs and Defects

Deleting a post with an image deletes the post data from Haystack but fails to delete the image from the Amazon S3 image bucket
Login via Google/Facebook has yet to be implemented

# Install and Run Guide

## Downloading the Application

Firstly, Git will need to be installed on your computer. If it is not, you can install it by following the instructions [here](https://git-scm.com/downloads). Make sure that you can run Git by typing git -v in a terminal to see what version is currently installed.

To download the application, navigate in your terminal to whatever directory you would like the project to be stored in. Then, execute git clone <url>, where <url> is the URL given by clicking “Clone” at the top of this page.

## Installation Prerequisites

To run this application, all of the following will need to be installed:

### Node.js

Node.js is a runtime for JavaScript that enables running JavaScript code in the server instead of just in the browser, enabling the creation of frontend and backend components with the same programming language. It can be installed [here](https://nodejs.org).

### React.js and other frontend dependencies

React.js is the frontend framework that our application uses. To install, simply navigate to the frontend folder of the application in your terminal and execute npm install. This will read the JSON file containing our dependencies, including React, and install all of them.

### Express.js and other backend dependencies

Express.js is the backend framework that our application uses, allowing the client to interface with our database and file storage. To install, simply navigate to the backend folder of the application in your terminal and execute npm install. This will read the JSON file containing our dependencies, including Express, and install all of them.

## Running the Application

To run the application, simply open two terminals and use one of the terminals to navigate to the backend folder of the application and execute npm start. After a few seconds, you should be given a confirmation message saying “Connected to HaystackDB!” confirming that you have connected to the database. Next, use the other terminal to navigate to the frontend folder of the application and execute npm start once more to run the frontend of the application. After another few seconds, a window of your default browser should automatically open leading you to the initial login landing page of Haystack.

## Troubleshooting
  
If images are not being displayed/you are unable to upload images, that most likely means that the current image bucket that is being used is no longer usable. The correct course of action would be to simply set up another S3 bucket and update the credentials in upload.js so that images can be uploaded and retrieved.
