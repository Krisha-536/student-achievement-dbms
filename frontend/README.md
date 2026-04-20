# VJTI Student Achievement Management System

React + Vite frontend connected to your Express + MySQL backend.

## Quick Start

### 1. Start your backend (in your backend folder)
```bash
node server.js
# Server running on port 5000 ✅
# MySQL Connected ✅
```

### 2. Start the frontend
```bash
npm install
npm run dev
# Open http://localhost:5173
```

## API Mapping (Frontend → Your Backend)

| Page       | Action              | Frontend call                        | Your route              |
|------------|---------------------|--------------------------------------|-------------------------|
| Home       | Load achievements   | `GET /api/`                          | `router.get('/')`       |
| Admin      | Load pending        | `GET /api/pending`                   | `router.get('/pending')`|
| Submit     | Add achievement     | `POST /api/add`                      | `router.post('/add')`   |
| Admin      | Approve / Reject    | `PUT /api/update/:id`                | `router.put('/update/:id')` |

## DB Fields Used

Your `achievements` table:
```
id, name, roll_no, title, category, level, position, status
```
Status values: `pending`, `approved`, `rejected`

## Change Backend URL

Edit `.env`:
```
VITE_API_URL=http://your-server-ip:5000/api
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx / .css
│   └── AchievementCard.jsx / .css    ← uses DB field names (roll_no etc.)
├── pages/
│   ├── HomePage.jsx    ← GET /api/
│   ├── SubmitPage.jsx  ← POST /api/add
│   └── AdminPage.jsx   ← GET /api/ + /pending, PUT /api/update/:id
├── utils/
│   └── api.js          ← All axios calls, matches your routes exactly
├── App.jsx
├── main.jsx
└── index.css
```
