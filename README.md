# Clinic Appointment System 🏥

A clinic appointment management system built with **Node.js, Express.js, MongoDB, and Mongoose**.

## Features

* Doctors CRUD
* Patients CRUD
* Appointments CRUD
* Search & filtering
* Doctor & patient references using Mongoose
* `populate()` for related data
* Prevent double booking
* Request validation using Zod
* Central error handling
* MVC architecture
* RESTful APIs

## Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* Zod
* HTML / CSS / JavaScript

## Frontend

A simple dashboard connected directly to the backend APIs.

> The backend was implemented as part of my backend learning journey.
> The frontend UI was created with AI assistance based on the implemented backend APIs.

## Run Locally

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/clinic_db
```

Then run:

```bash
npm start
```

Open:

```text
http://localhost:3000
```
