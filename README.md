# WOW Guild Monitor

WOW Guild Monitor is to help World of Warcraft guilds to monitor and analyze their guild activities.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Starting Local Environment

This project consists of:

-   **Backend**: Django (Python) server for Blizzard OAuth + guild data API
-   **Frontend**: React app (Vite) for the user interface

### 🔧 Prerequisites

-   Python 3.10+
-   Node.js 18+
-   `pip`, `venv`, and `npm` installed
-   Blizzard API client credentials from [Blizzard Developer Portal](https://develop.battle.net/access/clients)

---

### 📦 Backend Setup (Django)

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2. **Create and activate a virtual environment**:
    ```bash
    python -m venv wgm
    source venc/bin/activate # On Windows: venv/Scripts/activate
    ```
3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4. **Create a .env file**:
    ```bash
    BLIZZARD_API_CLIENT_ID=your_blizzard_client_id
    BLIZZARD_API_CLIENT_SECRET=your_blizzard_client_secret
    BLIZZARD_REDIRECT_URI=http://127.0.0.1:8000/wow_api/oauth/callback
    ```
5. **Apply database migrations and run the server**:
    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

### 📦 Frontend Setup (React + Vite)

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2. **Install dependencies**:
    ```bash
    npm install
    ```
3. **Create a .env file**:
    ```bash
    VITE_API_PREFIX=http://127.0.0.1:8000
    ```
4. **Start the Vite development server**:
    ```bash
    npm run dev
    ```

✅ The server will be running at: http://127.0.0.1:5173

## License

[MIT](no domain yet)
