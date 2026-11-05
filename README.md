# Estudar Portuguese

A flashcard web app for learning Portuguese from Portugal — built to practice Portuguese vocabulary.

---
## Live Demo

[View the Live Site](https://estudarportuguese-production.up.railway.app/)

---

## **Project Description**

Estudar Portuguese is a full-stack flashcard application designed for personal use while learning European Portuguese. The app serves random vocabulary cards from a PostgreSQL database, lets the user reveal the translation, and records whether they got it right or wrong — building a simple but real progress history over time.

---

## **Table of Contents**

- [Installation](#installation)
- [How to Use](#how-to-use)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## **Installation**

This project was created in GitHub Codespaces.

### **Prerequisites**

- A GitHub account
- A Railway account ([railway.app](https://railway.app))

### **Steps**

1. Open the repo on GitHub and click **Code → Codespaces → Create codespace on main**

2. Once the Codespace loads, install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```bash
   touch .env
   code .env
   ```
   In the file, set `DATABASE_URL` to your Railway Postgres connection string:
   ```
   DATABASE_URL=your_railway_postgres_connection_string
   ```

4. Run the database migration to create the tables:
   ```bash
   npx ts-node src/db/migrate.ts
   ```

5. Seed the database with starter vocabulary:
   ```bash
   npx ts-node src/db/seed.ts
   ```

   Note: Before running the commands above, copy `.env.example` to `.env` and fill in your own values. Never commit `.env`.
   
   Note: `seed.sql` inserts a small starter set of words. The live site uses a larger word list that is not included in this repository.

6. Start the development server:
   ```bash
   npx ts-node src/index.ts
   ```

---

## **How to Use**

1. Open the app in your browser
2. A Portuguese word is displayed on the flashcard
3. Think of the English translation, then click **Reveal**
4. Click **Got it** if you were correct, or **Missed it** if you weren't
5. Your score is saved automatically to the database
6. Your running correct/incorrect count is displayed below the card

---

## **Tech Stack**

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Database host | Railway |
| Dev environment | GitHub Codespaces |
| Frontend | HTML + CSS + Vanilla JS |

---

## **Project Structure**

```
estudar-portuguese/
├── src/
│   ├── index.ts          ← Express server entry point
│   ├── db.ts             ← Database connection pool
│   └── routes/
│       └── cards.ts      ← API routes for flashcards and scores
│   └── db/
│       ├── schema.sql    ← Table definitions
│       ├── migrate.ts    ← Runs schema against the database
│       ├── seed.sql      ← Starter vocabulary list
│       └── seed.ts       ← Runs seed data against the database
├── public/
│   ├── index.html        ← Flashcard UI
│   └── app.js            ← Frontend fetch logic
├── .env                  ← Local secrets (never committed)
├── .gitignore
└── README.md
```

---

## **API Endpoints**

| Method | Route | Description |
|---|---|---|
| GET | `/api/cards/random` | Returns one random flashcard |
| POST | `/api/cards/scores` | Saves a correct or incorrect result |
| GET | `/api/cards/progress` | Returns total correct and incorrect counts |

---

## **License**

This project is licensed under the Apache License 2.0. 

---

## **Credits**
flashcardo.com