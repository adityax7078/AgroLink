# AgroLink 🌾

> A direct marketplace connecting farmers to food processing units,
> with AI-powered price suggestions.

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React.js (Vite)             |
| Styling    | Tailwind CSS                |
| Backend    | Node.js + Express.js        |
| Database   | MySQL                       |
| Auth       | JWT (jsonwebtoken)          |
| AI Feature | OpenAI API (GPT-4o)         |
| Deployment | Vercel (FE) + Render (BE)   |

---

## Folder Structure

```text
agrolink/
├── frontend/        # React + Vite Client Application
├── backend/         # Node.js + Express API Server
├── .gitignore       # Root gitignore
└── README.md        # Project description and setup
```

---

## Database Design & Integration

### Database Choice: MySQL
We chose **MySQL** for the following reasons:
1. **Relational Data Structure**: Our primary entities (`Listing` and `Order`) are highly structured with relational logic. Listings belong to farmers, and orders match processors to sellers and crops, requiring strong relational consistency.
2. **Local Standard**: MySQL is a robust, widely adopted enterprise relational database engine running locally, allowing seamless access and administration via **MySQL Workbench**.
3. **ORM Integration**: We integrated **Prisma ORM** to connect the Node.js/Express backend with MySQL. Prisma provides type-safe queries, automatic migration files, and clean schema-to-database synchronization.

### Schema Diagram
Below is the database model mapping the tables, column types, keys, and logical relationships:

![AgroLink Database Schema Diagram](./W5_SchemaDiagram_26101094.png)

---

## Getting Started

### Database Setup & Migrations

Before launching the servers, set up the MySQL database:

1. **Verify MySQL Server**: Ensure MySQL server is running on `localhost:3306` (e.g. via MySQL Workbench or Windows services).
2. **Create the Database**: Open MySQL Workbench or your terminal and execute:
   ```sql
   CREATE DATABASE IF NOT EXISTS agrolink_db;
   ```
3. **Configure Environment Variables**:
   Verify that a `.env` file exists in the `backend` folder. Add the `DATABASE_URL` connection string:
   ```env
   PORT=5000
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/agrolink_db"
   ```
4. **Push Schema and Generate Client**:
   Navigate to the `backend` folder and run:
   ```bash
   npx prisma db push
   ```
   *Note: On backend startup, the database is automatically seeded with default listing and order records if tables are empty.*

### Frontend Setup & Development

To run the React frontend skeleton locally:

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open the browser at the local URL displayed (typically `http://localhost:5173` or similar).

4. **Verify Lints & Production Compilation**:
   ```bash
   npm run lint
   ```

### Backend Setup & Development

To run the Node.js/Express backend server locally:

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify the environment configuration**:
   Verify that a `.env` file exists (automatically initialized with `PORT=5000`). If missing:
   ```bash
   copy .env.example .env
   ```

4. **Run the API server in development mode**:
   ```bash
   npm run dev
   ```
   The backend will boot up and start listening on `http://localhost:5000` with hot-reloading active.

