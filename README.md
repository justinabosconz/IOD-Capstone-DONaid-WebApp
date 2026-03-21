DONaid – Donation Marketplace (Capstone Project)
DONaid is a full‑stack web application where users can register/login, post items for donation (with photos), browse and filter items, and message item owners in real time using Socket.IO.

✨ Features
✅ Register & Login (session tokens stored in DB)
✅ Create donation item listings (CRUD)
✅ Upload an item photo (stored on server in /uploads)
✅ Browse items with:  Category filter | Text search | “All items” / “My items” toggle
✅ View item detail (photo, description, owner)
✅ Owner-only edit/delete controls
✅ Real-time chat per item (Socket.IO rooms)
✅ Automated API testing (Jest + Supertest) + coverage report

🧰 Tech Stack

Frontend
  React (Vite)
  Material UI (MUI)
  Context API (Auth, Items, Socket)

Backend
  Node.js + Express (MVC)
  Sequelize ORM
  MySQL (localhost:3306)
  Socket.IO (real-time messaging)

Testing
  Jest + Supertest (API tests + coverage)

📁 Project Structure
DONaid/
  server/
    src/
      app.js
      server.js
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
    uploads/
    tests/
    jest.config.js
    .env
    .env.test
  client/
    src/
      api/
      components/
      context/
      pages/
      theme.js
    .env

✅ Prerequisites
Node.js
MySQL Server running locally

▶️ Install & Run (Development)
1) Start Backend (Express + MySQL)
Shellcd servernpm installnpm run devShow more lines
Expected output includes:

Server running on http://localhost:4000
DB authenticated
DB synced

2) Start Frontend (Vite + React)
Shellcd clientnpm installnpm run devShow more lines
Open:
Frontend: http://localhost:5173
Backend health check: http://localhost:4000/api/health

🧪 Testing (Jest + Supertest)
Install test dependencies (server)
Shellcd servernpm install --save-dev jest supertestShow more lines
Run tests (PowerShell)
Shellcd server$env:NODE_ENV="test"npx jest --runInBandShow more lines
Run coverage report (PowerShell)
Shellcd server$env:NODE_ENV="test"npx jest --coverage --runInBandShow more lines
Coverage report output:

server/coverage/lcov-report/index.html

Open the report:
ShellStart-Process .\coverage\lcov-report\index.htmlShow more lines

🔄 API Overview (Backend)
Auth
POST /api/auth/register → create user
POST /api/auth/login → returns { token, user }
GET /api/auth/me → requires Authorization header
POST /api/auth/logout → invalidates token

Items
GET /api/items → list items
GET /api/items/:id → item detail
POST /api/items → create item (auth required)
PUT /api/items/:id → update item (owner only)
DELETE /api/items/:id → delete item (owner only)
Chat (REST history)
GET /api/chat/:itemId/messages (auth required)
Real-time chat (Socket.IO)
Join room: joinItemRoom { itemId }
Send message: sendMessage { itemId, body }
Receive: newMessage

🔑 Auth Header (Important)
Protected routes require:
Authorization: Bearer <token>

The token is returned from /api/auth/login.

🖼️ Image Upload Notes

Item photos are uploaded from the client as base64 data URLs
Server saves images into: server/uploads/
Images are served via: http://localhost:4000/uploads/<filename>


🧠 Common Troubleshooting
“Failed to fetch” on login

Backend isn’t running. Start it:
Shellcd servernpm run devShow more lines


401 “Missing auth token” / “Invalid token”

Ensure the frontend sends:
Authorization: Bearer <token>
Log out then log back in (clears stale tokens)
Confirm server/.env SESSION_DAYS and DB sessions table exists

Can’t delete/update item

Only the owner can edit/delete their item.
Log in with the same user who created the item.

Vite plugin dependency error

Align Vite and @vitejs/plugin-react versions:
Shellnpm install -D @vitejs/plugin-react@latestShow more lines


👩‍💻 Author
Justina Bosco
Capstone Project – DONaid
