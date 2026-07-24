# 🔗 LNK.IO

A modern, full-stack URL shortening platform built with **React**, **Node.js**, **TypeScript**, and **Prisma**. It transforms long URLs into compact, shareable links with fast redirection and a clean user experience.

🌐 **Live Demo:** https://lnk-io.vercel.app

---

## 🚀 Overview

LNK.IO is a full-stack web application that allows users to shorten long URLs into unique, easy-to-share links.

The project demonstrates real-world backend development using TypeScript, Prisma ORM, and REST APIs while maintaining a responsive React frontend.

---

## ✨ Features

- 🔗 Generate short URLs instantly
- ⚡ Fast redirection
- ✅ URL validation
- 📱 Responsive interface
- 🎯 Unique short code generation
- 🗄 Database persistence using Prisma
- 🌍 Publicly accessible shortened links
- ⚙ REST API architecture

---

## 🛠 Tech Stack

### Frontend

- React
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- Prisma ORM
- SQL Database

### Deployment

- Vercel

---

## 📁 Project Structure

```
Link-Shortener
│
├── frontend/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── db.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
└── README.md
```

---

## 🔄 How It Works

1. User enters a long URL.
2. Backend validates the URL.
3. A unique short code is generated.
4. URL mapping is stored using Prisma.
5. A shortened URL is returned.
6. Opening the short URL redirects to the original destination.

---

## 📚 Backend Architecture

```
React Frontend
        │
        ▼
Express REST API
        │
        ▼
Business Logic
        │
        ▼
Prisma ORM
        │
        ▼
SQL Database
```

---

## 🎯 Learning Outcomes

This project helped me gain experience with

- TypeScript
- Express.js
- REST API Development
- Prisma ORM
- Database Migrations
- Backend Architecture
- React Integration
- Environment Variables
- Production Deployment
- Full-Stack Development

---

## 📸 Screenshots

### Home Page

<img width="1902" height="971" alt="image" src="https://github.com/user-attachments/assets/cbee11b2-0442-49cf-a7a3-74204da2b55b" />



## 👨‍💻 Author

**Mohit Sharma**

GitHub: https://github.com/MohitSharma2003

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.

---

## 📄 License

This project is licensed under the MIT License.
