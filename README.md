Perfect 👍 I’ll expand your **README.md** so it includes both **Nest CLI run commands** and **npm scripts** (so you don’t need to type long commands every time).

Here’s the updated `README.md` with **run commands** included:

```markdown
# Eventure Microservices

This project is a microservices-based backend for **Eventure**, built with **NestJS**.  
It is designed for scalability, modularity, and easy integration with frontend clients.

---

## 🏗️ Microservices Implemented

- **Auth Service** – Handles user authentication and JWT token management  
- **User Service** – Manages user profiles and related data  
- **Event Service** – Create, update, and fetch events  
- **Friend Service** – Manage friend lists and friend-related events  

An **API Gateway** is implemented to route client requests to the respective microservices.

---

## ⚙️ Tech Stack

- [NestJS](https://nestjs.com/) – Framework for building scalable server-side apps  
- [MongoDB + Mongoose](https://mongoosejs.com/) – Database and ORM  
- [Redis](https://redis.io/) – Message broker for microservice communication  
- [Docker](https://www.docker.com/) – Containerization (optional for deployment)  

---

## 📂 Project Structure

```

event-microservice/
│── api-gateway/      # Central entry point for client requests
│── auth-service/     # Authentication microservice
│── user-service/     # User management microservice
│── event-service/    # Event management microservice
│── friend-service/   # Friend management microservice
│── shared/           # Shared modules & utilities

````

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/micro-services-eventure.git
cd micro-services-eventure
````

### 2. Install dependencies (inside each service)

```bash
npm install
```

---

## ▶️ Run Commands

You can run services using the **Nest CLI** directly, or define **npm scripts** inside each service’s `package.json`.

### Using Nest CLI

Run the services individually in separate terminals:

```bash
# API Gateway
cd api-gateway
nest start api-gateway --watch

# Auth Service
cd auth-service
nest start auth-service --watch

# User Service
cd user-service
nest start user-service --watch

# Event Service
cd event-service
nest start event-service --watch

# Friend Service
cd friend-service
nest start friend-service --watch
```

## 🔌 API Gateway Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/auth/login`         | User login          |
| POST   | `/auth/register`      | User registration   |
| GET    | `/users/:id`          | Fetch user by ID    |
| POST   | `/events`             | Create a new event  |
| GET    | `/events`             | Fetch all events    |
| GET    | `/friends/:id/events` | Get friend’s events |

