# done.

## Live Demo

**Frontend:** https://done-lime-eight.vercel.app/

**Backend API:** https://done-2rvj.onrender.com/docs

A minimal daily productivity logger. One entry per day. Locked forever after midnight.

## What is this?

done. is a lightweight web application that helps developers and professionals answer one simple question every day —
**"What did I actually do today?"**

Users log into a clean calendar interface, write what they completed, and the entry is permanently locked after midnight — creating an honest, uneditable daily record of progress.

## Features

- One entry per day — focused and intentional
- Entries locked after midnight — cannot be edited retroactively
- Rich text editor with heading, bullet, and bold formatting
- Monthly calendar view with visual indicators for logged days
- Real streak counter based on consecutive days logged
- Secure authentication — each user sees only their own entries
- Motivational quote — refreshes every 10 hours
- Live clock display

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Rich Text | TipTap Editor |
| Routing | React Router |
| Backend | Python, FastAPI |
| Authentication | JWT, bcrypt |
| Database | PostgreSQL |
| ORM | SQLAlchemy |

## Project Structure

done./
├── src/
│ ├── components/
│ │ └── Calendar.jsx
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Signup.jsx
│ │ └── Landing.jsx
│ ├── context/
│ │ └── AuthContext.jsx
│ └── main.jsx
└── backend/
└── app/
├── main.py
├── models.py
├── schemas.py
├── database.py
├── auth.py
└── routers/
├── users.py
└── entries.py


## Getting Started

The app is deployed and can be used directly without local setup via the Live Demo above.

### Prerequisites
- Node.js
- Python 3.10+
- PostgreSQL

### Frontend
```bash
npm install
npm run dev



### Backend
Terminal 
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload


Environment Variables

Create a .env file in the backend folder:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/done
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30


API Endpoints
Method	Endpoint	      Description
POST	/auth/register	  Register new user
POST	/auth/token	      Login and get JWT token
GET	    /entries	      Get all entries for logged in user
POST	/entries	      Create new entry
PUT	    /entries/{id}	  Update existing entry
