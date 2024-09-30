# Task Management Application

This is a simple task management application that allows users to register, login, and manage tasks. 
<br/>The frontend is built with Vue.js and the backend uses Node.js/Express with JWT-based authentication.

## Requirements

- **Node.js** (version 14+)
- **npm** (version 6+)
- **Vue.js**

## Installation and Setup

### Backend Setup + run (project - server)
1. run `npm install`
2. run `npm start`
3. since the requirement is running on https locally, in order to make the frontend work, we'll need to accept the security certificate on https://localhost:3000. 
   <br/>go to https://localhost:3000 and accept and proceed even if it is not secure (otherwise the client will not work) 

### Frontend run
1. go to `client/index.html`
2. open `index.html` in browser

## Features
- User Registration and Login with hashed passwords.
- JWT Authentication for secure API calls.
- Task management (create, view, and delete tasks).
- Basic error handling for user inputs and authentication.
- Frontend built using Vue.js, making API requests to the backend.

## API Endpoints
1. <b>User Authentication</b>
   - `POST` /register: Registers a new user.
   - `POST` /login: Authenticates the user and returns an access token.
   - `POST` /token: Refreshes the access token using the refresh token.
2. <b>Task Management</b>
   - `GET` /tasks: Fetches the list of tasks.
   - `PUT` /tasks/id: Update a task
   - `POST` /tasks: Creates a new task (requires title and description).
   - `DELETE` /tasks/id : Deletes a task by ID.

## Security Measures
1. JWT Authentication: Used to secure API requests.
2. Password Hashing: User passwords are stored securely using bcrypt.
3. CORS: Enabled to allow the frontend to make API requests to the backend.
4. task content is encrypted in the db, and decrypted upon request

## Known Issues + Notes
1. I usually write in typescript, using nestJs. I have been working with express in the past, but it was 4 years ago, so the js code is not perfect
2. <b>SSL</b>: If you encounter SSL issues, you may need to accept the security certificate on https://localhost:3000 
        or adjust the request to handle self-signed certificates.
3. As a general rule, I would not save any secure content on the github project, this is just for the purposes of the assignment (for example - `server.cert`,`server.key`,`JWT_SECRET`,`JWT_REFRESH_SECRET`,...).
4. UI is very basic - I'm not a frontend developer, and this is the minimal I could do to make it work
   - No refresh token implementation - the server implemented this, but the client does not use it.
   - calling PUT api for task is implemented in the server, but not in use in the client
5. used libraries has some deprecations - i'm ignoring it for the purposes of the assignment. 
6. plan for future server testings:
   <br/>In general, what I would do for this is:
   - server unit tests:
     - each route
     - check all errors thrown (`Messages`)
     - check authentication 
       - login with a non-registered user
       - login with a non-valid password
       - register with a username which already exists
     - check that `user A` is not allowed to access the tasks of `user B`
     - check encrypt/decrypt methods
   - server integration tests for the full flow (happy flow)
     - Test1: (new user - register is required)
       - user registers
       - user logs in
       - user add tasks
       - user delete tasks
     - Test2: (user already registered)
       - user logs in
       - fetching existing tasks 
       - user add tasks
       - user delete tasks