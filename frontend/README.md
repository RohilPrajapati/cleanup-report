# React Frontend Application

A React frontend application built with **React 18+** (or your version) and Dockerize for production.  

---

## Project Overview

This frontend is part of a full-stack application with a Django backend. It communicates with the backend via REST APIs and provides a modern, responsive interface, with authentication.  

---

## Features

- React functional components with hooks
- API integration with backend
- Dockerize for easy deployment
- Implementation of client side jwt authentication
- Optional runtime config injection

---

## Tech Stack

- **React** – UI library
- **React Router** – Routing
- **Axios / Fetch** – API calls
- **Raw CSS** – Styling
- **Docker & Docker Compose** – Containerization
- **Nginx** – Production static server

---

## Project Structure

```
frontend/
├── public/
│ ├── index.html
│ └── ...
├── src/
│ ├── components/           # Reusable UI components i.e. Navbar
│ ├── pages/                # Application pages
│ │ ├── api/                # page api calls
│ │ │ │── calls.js          # contain api calls page-wise
│ │ │ └── index.js          # api route constants
│ │ ├── components/         # page-wise component can be table, form etc
│ │ │ └── components_1.js   
│ │ └── page_1.js           # react page component
│ ├── config/               # const value like API_URL
│ ├── plugins/              # axios stuff
│ ├── routers/              # project routers
│ ├── helpers/              # contains helper function related to authentication
│ ├── layouts/              # Wrapper components/Container which contain AuthLayout
│ ├── App.js                # Main app component
│ └── index.js              # Entry point
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```


## Environment Variables

Create a .env from .example.env file in frontend/:
```
# http://localhost:8000 or http://backend:8000 or /api
REACT_APP_API_HOST=<api-url> 
```

install dependency
```bash
npm install
```

### Running the app 
#### developement
```bash
npm start
```
- Runs the app in development mode
- Open http://localhost:3000 to view in browser
- Hot-reloading enabled

#### Production
```bash
npm run build
```
- Builds the app for production
- Outputs to /build directory
- Serve with Nginx or any static server