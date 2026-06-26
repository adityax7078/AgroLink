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

## Getting Started

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
   npm run build
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

