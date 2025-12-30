# 🛒 E-Commerce Platform (Microservices Architecture)

A **scalable, secure, microservices-based e-commerce application** built with **Angular**, **ASP.NET Core Web API**, **SQL Server**, and an **API Gateway**, following real-world backend architecture and clean code practices.

This project demonstrates **end-to-end system design**, including authentication, product management, cart workflows, filtering with cursor-based pagination, and gateway-level aggregation.

---

## 🧠 Key Highlights

* ✅ **Microservices Architecture** (Auth, Product, Cart)
* ✅ **API Gateway** for routing & response aggregation
* ✅ **JWT Authentication & Role-Based Authorization**
* ✅ **Cursor-Based Pagination** (no offset pagination)
* ✅ **Unified Product Filtering** (category + search-ready)
* ✅ **Cart Management** (add, remove, save-for-later, update quantity)
* ✅ **Admin Dashboard** for product management
* ✅ **Angular Frontend** integrated via Gateway only

---

## 🏗️ System Architecture

```
Client (Angular)
       |
       v
API Gateway (ASP.NET Core)
       |
       |── Auth Service
       |── Product Service
       |── Cart Service
       |
   SQL Server (per service)
```

### Why this architecture?

* Services are **independently deployable**
* No direct service-to-service coupling
* Gateway handles **security, routing, and aggregation**
* Easy to extend (Search, Orders, Payments)

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* Token issued by **Auth Service**
* Token validated by **API Gateway**
* Role-based access:

  * `USER` → shopping & cart
  * `ADMIN` → product management
* JWT is attached automatically via Angular HTTP interceptor

---

## 📦 Microservices Overview

### 1️⃣ Auth Service

Handles user authentication and authorization.

**Responsibilities**

* User registration
* User login
* JWT token generation
* Role claims (USER / ADMIN)

---

### 2️⃣ Product Service

Manages all product-related operations.

**Features**

* Trending products
* Shop by category
* Unified filtering (price, color, category, trending)
* Cursor-based pagination for infinite scroll
* Admin product CRUD

**Cursor Pagination Strategy**

* Composite cursor: `(CreatedAt, Id)`
* Stable, scalable, index-friendly
* No page numbers

---

### 3️⃣ Cart Service

Manages user cart state.

**Features**

* Add item to cart
* Remove item
* Update quantity
* Save item for later
* Move item back to cart
* User isolation via JWT claims

---

### 4️⃣ API Gateway

Single entry point for frontend.

**Responsibilities**

* Route requests to correct microservice
* Validate JWT tokens
* Aggregate responses (Cart + Product)
* Enforce security boundaries

**Example Aggregation**

```
GET /cart/details
→ Cart Service
→ Product Service
→ Merged response
```

---

## 🖥️ Frontend (Angular)

### Core Features

* Complete authentication flow (login & register)
* Home page with trending products
* Shop by category
* Filter products (price, color, trending)
* Infinite scroll using cursor pagination
* Full cart management
* Admin dashboard

### Angular Architecture

```
src/app
 ├── core/
 │   ├── services/
 │   ├── guards/
 │   ├── interceptors/
 ├── features/
 │   ├── auth/
 │   ├── home/
 │   ├── shop/
 │   ├── cart/
 │   ├── admin/
 ├── shared/
```

---

## 🔄 API Overview (via Gateway)

### Authentication

```
POST /auth/register
POST /auth/login
```

### Products

```
GET  /products/trending
POST /products/query
POST /products        (ADMIN)
PUT  /products/{id}   (ADMIN)
DELETE /products/{id} (ADMIN)
```

### Cart

```
GET    /cart
POST   /cart
DELETE /cart/{productId}
PUT    /cart/{productId}/quantity
PUT    /cart/{productId}/save
PUT    /cart/{productId}/move
GET    /cart/details
```

---

## 🗃️ Database Design

* Each microservice owns its **own database**
* No shared tables across services
* SQL Server used with EF Core
* Domain rules enforced at entity level

---

## 🛠️ Tech Stack

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* JWT Authentication
* API Gateway (YARP / custom routing)

### Frontend

* Angular
* TypeScript
* RxJS
* Angular Router
* HTTP Interceptors

### DevOps (Local)

* Docker
* Docker Compose

---

## ▶️ Running the Project Locally

### Prerequisites

* .NET 8 SDK
* Node.js (v18+)
* Angular CLI
* SQL Server / Docker

### Backend

```bash
docker-compose up
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

---

## 🔮 Future Enhancements

* Search Service (Elastic / OpenSearch)
* Redis caching
* Order & Payment microservices
* Event-driven communication
* CI/CD pipelines
* Observability (logs, metrics, tracing)

---

## 🎯 What This Project Demonstrates

* Real-world microservices design
* Clean architecture & separation of concerns
* Secure authentication & authorization
* Scalable pagination & filtering
* API Gateway aggregation pattern
* Production-ready frontend integration

---

## 👨‍💻 Author

**Tarun Boricha**
Software Engineer | .NET | Full-Stack | Microservices

* 🔗 GitHub: [https://github.com/tarunboricha](https://github.com/tarunboricha)
* 🔗 LinkedIn: [https://linkedin.com/in/tarunboricha](https://linkedin.com/in/tarunboricha)
