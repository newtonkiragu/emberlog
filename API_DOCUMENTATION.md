# Emberlog API Documentation

## Overview

Emberlog provides a journaling API with authentication, dashboard insights, and journal entry management. This document
details available API endpoints, request formats, response structures, and authentication requirements.

## Authentication

Emberlog uses NextAuth.js for authentication.

- **Session-based authentication:** Users must be logged in to access protected endpoints.

- **Endpoints:**

    - **/api/auth/register**: User registration
    - **/api/auth/session**: Get current session

- Headers:

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your-token>"
}
```

## Endpoints

1. **User Registration**

**Endpoint:** POST /api/auth/register

**Request:**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

**Response:**

```json

{
  "message": "User registered successfully",
  "user": {
    "id": "123",
    "email": "johndoe@example.com"
  }
}
```

2. **Dashboard Data**

**Endpoint:** GET /api/v1/dashboard?date=YYYY-MM-DD

**Description:** Retrieves journal entries, mood analysis, and frequently used tags for a given date.

**Response:**

```json
{
  "entries": [
    {
      "id": "1",
      "title": "My Entry",
      "content": "Today was great..."
    }
  ],
  "moodAnalysis": "HAPPY",
  "tags": [
    "work",
    "personal"
  ]
}
```

3. **Journal Entries**

Create Entry

**Endpoint:** POST /api/v1/entries/

**Request:**

```json
{
  "title": "A New Day",
  "content": "Today I learned about Next.js..."
}
```

**Response:**

```json
{
  "entry": {
    "id": "123",
    "title": "A New Day",
    "content": "Today I learned about Next.js..."
  }
}
```

**Fetch Entries**

**Endpoint:** GET /api/v1/entries/

**Query Parameters:**

- **timeframe:** today, this_week, this_month, last_3_months, this_year

- **mood:** Filter by mood

- **tags:** Comma-separated tags

- **search:** Search text

- **date_range:** YYYY-MM-DD,YYYY-MM-DD

- **bookmarked:** true/false

**Response:**

```json
{
  "entries": [
    {
      "id": "1",
      "title": "My Entry"
    }
  ],
  "nextCursor": "2"
}
```

4. **Entry Summary**

**Endpoint:** GET /api/v1/entries/summary

**Response:**

```json
{
  "totalEntries": 100,
  "avgWordCount": 120,
  "mostUsedTags": [
    {
      "tag": "work",
      "count": 10
    }
  ],
  "moodTrends": [
    {
      "date": "2025-03-21",
      "mood": "HAPPY"
    }
  ]
}
```

## **Error Responses**

**Common Errors:**

```json
{
  "error": "Unauthorized",
  "status": 401
}
```

```json
{
  "error": "Internal Server Error",
  "status": 500
}
```

## **Notes**
- Authentication is required for all endpoints.
- Pagination is supported using cursor in /api/v1/entries/.
- AI-driven sentiment analysis and auto-tagging are integrated.