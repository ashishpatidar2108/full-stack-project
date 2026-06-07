# To-Do List App

Hy , this is my integrated To-Do List app. This is a full stack project. I made frontend with React and backend with Node.js, Express and MongoDB.

In this app user can add task, edit task, delete task, search task and mark task complete. Frontend and backend are connected with API.

## Project Folders

```text
assignment-8-todo-app/
|-- frontend/
|-- todo-backend/
|-- .gitignore
`-- README.md
```

## Features

- User can add new task
- User can see all tasks
- User can edit task
- User can delete task
- User can mark task as pending, in progress or completed
- User can search task by title or description
- Loading message show when data is loading
- Error message show when something wrong happen
- App works on laptop and mobile also

## Technologies Used

## Frontend

- React
- Axios
- CSS
- useState and useEffect hooks

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Express Validator
- CORS
- Helmet
- Morgan

## Code Organisation

Frontend code is kept inside `frontend/src`.

- `components/TaskForm.jsx` is used for add task form
- `components/TaskList.jsx` is used for show, edit, delete and status update
- `services/api.js` is used for Axios API calls
- `app.js` is main React component

Backend code is kept inside `todo-backend/src`.

- `routes/` has API routes
- `controllers/` has request and response logic
- `services/` has task database logic
- `models/` has MongoDB task model
- `validators/` has validation rules
- `middlewares/` has error and validation middleware

## State Management

I used React `useState` for handling application state like tasks, loading, error, search, filters and pagination. I also used `useEffect` for loading tasks when filters change.

## How To Run Backend

First go in backend folder:
Install backend packages
--> npm install

Create `.env` file in `todo-backend` folder:

```env
PORT=5000
MONGO_URI= mongodb+srv://ashishpatidar2108_db_user:3OC97qiKFIwQhibd@cluster12.mmqamnp.mongodb.net/?appName=Cluster12
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

## Run backend:
--> npm run dev

Backend will run on:  http://localhost:5000

## Run Frontend
Open frontend folder:
Install frontend packages:  --> npm install

## Create `.env` file in `frontend` folder:
REACT_APP_API_URL=http://localhost:5000

Run frontend: --> npm start

Frontend open on:  http://localhost:3000

## Environment Variables

## Backend Environment Variables

 Variable                   Work 
 `PORT`                  Backend port number 
 `MONGO_URI`             MongoDB connection string 
 `NODE_ENV`             App environment 
 `CORS_ORIGIN`          Frontend URL allowed by backend 

## Frontend Environment Variables

 Variable                   Work 
 `REACT_APP_API_URL`    Backend API base URL 


## API Endpoints

These API are used by frontend to connect with backend.

 Method          Endpoint                     Work 

 GET            `/health`                   Check backend is running 
 GET            `/api/tasks`                Get all tasks 
 GET            `/api/tasks/:id`            Get one task 
 POST           `/api/tasks`                Add new task 
 PATCH          `/api/tasks/:id`            Update task 
 PATCH          `/api/tasks/:id/status`      Update task status 
 DELETE         `/api/tasks/:id`             Delete task 

For search task:   --> GET /api/tasks?q=taskname

## Postman

I also added Postman collection in backend folder.
todo-backend/postman_collection.json
http://localhost:5000

## Testing I Did

## Backend Testing

- I tested all API in Postman
- I checked add task API
- I checked get all task API
- I checked update task API
- I checked delete task API
- I checked search task API
- I checked validation and error messages

## Frontend Testing

- I added task from frontend
- I edited task from frontend
- I deleted task from frontend
- I changed task status
- I searched task and result came correct
- I checked loading and error message

## Deployment Steps

## Backend On Render

1. Push full code on GitHub
2. Go to Render
3. Create new Web Service
4. Select backend folder or set root directory as `todo-backend`
5. Add backend environment variables
6. Deploy backend

## Frontend On Netlify

1. Push full code on GitHub
2. Go to Netlify
3. Add new site from GitHub
4. Set base directory as `frontend`
5. Add `` with backend Render URL
6. Deploy frontend

## My Deployed Links

- Frontend: https://full-stack-project8.netlify.app/
- Backend: https://full-stack-project8.onrender.com

## Problems I Faced

 Problem & Fixed 
-->Frontend was not connecting with backend 
   I added CORS in backend.
-->MongoDB was not connecting 
    I checked MongoDB connection string and env variable.
-->React state was not updating 
   I used async await and set state after API response.
-->Env file was not working 
   I used correct env variable name.
-->Loading was not showing
   I added loading state.
-->Error was not showing
   I added try catch and error message. 
-->Frontend API URL changes after deploy  
   I used `REACT_APP_API_URL` variable .

## Submission Notes

- Full codebase should be pushed on GitHub
- `frontend` and `todo-backend` both should be in same repository
- Real `.env` file should not be pushed
- Backend can be hosted on Render
- Frontend can be hosted on Netlify
- README explains setup, env variables, deployment and challenges

## What I Learned

In this project I learned how to connect frontend and backend. I learned React, API calling, Express routes, MongoDB database, environment variables and deployment steps.

This project helped me to understand full stack development.
