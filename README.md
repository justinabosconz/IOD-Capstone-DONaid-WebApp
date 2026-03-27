🌱 DONaid — Community Donation Platform
DONaid is a full‑stack web application designed to make giving easier. Users can upload items they want to donate, browse available items, and connect with others in their community. Built as a capstone project, DONaid focuses on simplicity, accessibility, and meaningful impact.

✨ Features

🧑‍🤝‍🧑 User Accounts

- Secure user registration and login
- Session-based authentication
- Profile management

  🎁 Donation Items

- Upload items with images, descriptions, and categories
- Search and filter items
- View item details
- Mark items as available/unavailable

  💬 Real-Time Communication

- WebSocket-powered messaging between donors and recipients
- Live updates for chat and item status

  🗄️ Database-Driven

- SQL database managed through Sequelize ORM
- Structured tables for Users, Items, Sessions, and Chat Messages

🏗️ Tech Stack

| Layer     | Technology                      |
| --------- | ------------------------------- |
| Frontend  | React (Vite), Material UI (MUI) |
| Backend   | Node.js + Express (MVC)         |
| Database  | MySQL + Sequelize ORM           |
| Real-Time | Socket.IO (real-time messaging) |
| Testing   | Jest + Supertest                |

📁 Project Structure

DONaid/
│── server/src
│ ├── app.js
│ ├── server.js
│ ├── dbConnect.js
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── sockets/
│ ├── utility/
│ ├── tests/
│ ├── .env
│ ├── .env.test│
|
│── client/
│ ├── src/
│ ├── api/
│ ├── components/
│ ├── context/
│ ├── pages/
│ ├── .env
│
└── README.md (this file)

✅ Prerequisites
Node.js
MySQL Server running locally

▶️ Install & Run (Development)

1. Start Backend (Express + MySQL)
   Shellcd servernpm installnpm run devShow more lines
   Expected output includes:

Server running on http://localhost:4000
DB authenticated
DB synced

2. Start Frontend (Vite + React)
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

🤝 Contributing
Contributions are welcome!
Feel free to open issues or submit pull requests.

📜 License
This project currently has no license.
You may add one (MIT recommended).

💛 Acknowledgements

- Built as part of the IOD Capstone
- Inspired by community-driven generosity
- Thanks to everyone who supported the development journey

👩‍💻 Author
Justina Bosco
Capstone Project – DONaid
