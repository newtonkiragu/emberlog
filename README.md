Disclaimer: Emberlog is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Emberlog

Emberlog is a Next.js-based personal journaling app designed for seamless journaling with AI-powered insights. It allows
users to log their daily thoughts, track emotions, and analyze patterns over time.

### Key Features:

**Journaling Interface**: A clean and intuitive UI for writing and managing entries.

AI-powered Insights**: Sentiment analysis and auto-tagging using Hugging Face models.

**Data Visualization**: Heatmaps, word clouds, and charts for tracking mood trends.

**Filtering & Search**: Find past journal entries based on timeframe, mood, and tags.

**Theming & Customization**: Light/dark mode with customizable color themes.

**Authentication & Security**: NextAuth.js integration with PostgreSQL for secure user login.

### Tech Stack:

*Frontend*: Next.js (App Router), React, TypeScript

*Backend*: Prisma, PostgreSQL, NextAuth.js

*AI Integration*: Hugging Face Inference API

*State Management*: Context API (considering Redux Toolkit)

Emberlog is built with scalability and usability in mind, making personal journaling more insightful and engaging. 🚀

## Getting Started
### Documentation
- [API Documentation](API_DOCUMENTATION.md)
- [System Design Document](SYSTEM_DESIGN_DOCUMENT.md)
- [Technical Decision Log](TECHNICAL_DECISION_LOG.md)

### 📌 Prerequisites

Before running the application, ensure you have the following installed:

- Node.js v22.14 (or later)
- PostgreSQL (for database storage)
- Yarn (preferred package manager, but npm works as well)
- Prisma (ORM for database migrations and queries)

### 🚀 Installation

#### 📂 Clone the repository

```bash
git clone git@github.com:newtonkiragu/emberlog.git
cd emberlog
```

#### 📦 Install dependencies

```bash
yarn install
```

#### 🛠️ Environment Setup
```dotenv
DATABASE_URL="postgresql://karanu:password@localhost:5432/emberlog?schema=public"
HUGGINGFACE_API_TOKEN="hf_token"
NEXTAUTH_SECRET="stI7n61Aoc8ZtMlpuubgvfQGUix1uQbNg9MPHiQaiO4="
NEXTAUTH_URL="http://localhost:3000"
```
>Replace:
    
    - karanu:password with your actual PostgreSQL username and password.
    - hf_token with a valid Hugging Face API Token.
    - NEXTAUTH_SECRET should be a randomly generated secret for authentication security.

#### 🛢️ Database Setup
Run the following Prisma commands to set up the database:
```bash
# Push the Prisma schema to your database
yarn prisma db push

# Generate the Prisma client
yarn prisma generate
```