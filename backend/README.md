# ICMS Backend

Backend of ICMS project using FastAPI.

## Setup

### 1. Create a virtual environment

Feel free to use whatever tool you want. Make sure that you are in the `backend` directory and have Python 3.8+ installed.

If you're not sure what's going on, here's an example using `venv`. You can install it using `pip install venv`.

Create the virtual environment in the `.venv` directory

```bash
python3 -m venv .venv
```

Activate the virtual environment

Linux/MacOS

```bash
source .venv/bin/activate
```

Windows

```bash
.venv\Scripts\activate.bat
```

You should see a `(.venv)` prefix in your terminal after activating.

### 2. Install dependencies

```bash
pip install -r requirements.txt
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

### 3. Configure environment variables

Copy the `.env.example` file to a new `.env` file and fill the variables. Ensure that you have the correct values for the variables.

DB_NAME: Name of your database (e.g. comp3278). MAKE SURE YOU CREATE THE DATABASE FIRST!

DB_USER: Username of your database (e.g. root)

DB_PASSWORD: Password of your database

DB_HOST: Host of your database (e.g. localhost)

### 4. Run the server

```bash
python3 -m uvicorn app.main:app --reload
```

The server should be running on `http://localhost:8000`. You may visit the generated docs at `http://localhost:8000/docs` on your browser.
