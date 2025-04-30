# ProjectBM

## Installation

This project has a NestJS backend and a ReactJS frontend. Follow the instructions below to get each part running.

### Backend (NestJS)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables:**
    * Create a `.env` file based on `.env.example` (if present).
    * Set necessary environment variables (e.g., database URLs, API keys).

4.  **Run database migrations (if applicable):**
    ```bash
    # Example for TypeORM
    npm run typeorm:migrate
    # or
    yarn typeorm:migrate
    ```

5.  **Start the backend development server:**
    ```bash
    npm run start:dev
    # or
    yarn start:dev
    ```
    The backend will typically run on `http://localhost:3000`.

### Frontend (ReactJS)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables:**
    * Create a `.env` file based on `.env.example` (if present).
    * Set necessary environment variables (e.g., API base URL).

4.  **Start the frontend development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The frontend will typically run on `http://localhost:3001`.

## Project Structure

ProjectBM/
├── backend/        <-- NestJS Backend
│   ├── src/
│   ├── ...
│   ├── package.json
│   └── ...
├── frontend/       <-- ReactJS Frontend
│   ├── public/
│   ├── src/
│   ├── ...
│   ├── package.json
│   └── ...
├── .gitignore
├── README.md
└── ...
