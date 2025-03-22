# Emberlog System Design Document

## 1. System Architecture

### Architecture Diagram

```
+----------------------+       +--------------------+       +------------------+
|    Next.js (UI)     | ----> | Next.js API Layer  | ----> |  PostgreSQL DB   |
|   (Client-side)     |       |   (Server-side)    |       |  (Data Storage)  |
+----------------------+       +--------------------+       +------------------+
          |                             |                     
          v                             v                      
+----------------------+       +--------------------+
|   Authentication     | ----> | Prisma ORM         | 
| (NextAuth.js + JWT)  |       | (Database Access)  | 
+----------------------+       +--------------------+  
```

### Explanation

- **Frontend:** Built using Next.js with client-side and server-side rendering.
- **Backend:** Next.js API layer handling authentication, journaling, and data processing.
- **Database:** PostgreSQL via Prisma ORM for structured data storage.
- **Authentication:** NextAuth.js for session-based authentication with JWT support.

## 2. Data Model Design

### User Table

| Field     | Type          | Description             |
|-----------|---------------|-------------------------|
| id        | String (UUID) | Unique identifier       |
| email     | String        | Unique user email       |
| password  | String        | Secure password storage |
| name      | String?       | User's full name        |
| createdAt | DateTime      | Account creation date   |
| updatedAt | DateTime      | Last update timestamp   |

### Session Table

| Field        | Type     | Description             |
|--------------|----------|-------------------------|
| id           | String   | Unique identifier       |
| sessionToken | String   | Unique session token    |
| userId       | String   | Foreign key to Users    |
| expires      | DateTime | Session expiration date |

### Entry Table

| Field      | Type     | Description           |
|------------|----------|-----------------------|
| id         | String   | Unique identifier     |
| title      | String   | Journal entry title   |
| content    | String   | Journal content       |
| createdAt  | DateTime | Entry creation date   |
| updatedAt  | DateTime | Last update timestamp |
| isArchived | Boolean  | Archive status        |
| authorId   | String   | Foreign key to Users  |
| tags       | Tag[]    | Associated tags       |
| tagIds     | String[] | Tag identifiers       |
| mood       | Mood     | Mood of the entry     |
| moodScore  | Float?   | Mood score            |
| bookmarked | Boolean  | Bookmark status       |

### Tag Table

| Field     | Type     | Description       |
|-----------|----------|-------------------|
| id        | String   | Unique identifier |
| name      | String   | Tag name          |
| score     | Float?   | Tag score         |
| createdAt | DateTime | Tag creation date |

### DailyMoodSummary Table

| Field     | Type     | Description           |
|-----------|----------|-----------------------|
| id        | String   | Unique identifier     |
| date      | DateTime | Date of the summary   |
| mood      | Mood     | Mood of the day       |
| userId    | String   | Foreign key to Users  |
| createdAt | DateTime | Summary creation date |
| updatedAt | DateTime | Last update timestamp |

### EntrySummary Table

| Field          | Type     | Description              |
|----------------|----------|--------------------------|
| id             | String   | Unique identifier        |
| userId         | String   | Foreign key to Users     |
| totalEntries   | Int      | Count of journal entries |
| avgWordCount   | Float    | Average word count       |
| mostUsedTags   | Json     | Most frequent tags       |
| moodTrends     | Json     | Mood analytics           |
| entryFrequency | Json     | Entry frequency          |
| createdAt      | DateTime | Summary creation date    |
| updatedAt      | DateTime | Last update timestamp    |

### Mood Enum

| Value    |
|----------|
| TERRIBLE |
| BAD      |
| SAD      |
| MEH      |
| NEUTRAL  |
| OKAY     |
| GOOD     |
| GREAT    |
| HAPPY    |

## 3. Security Measures Beyond Basic Authentication
Role-Based Access Control (RBAC): Restricts access to user data.
SQL Injection & XSS Protection: Sanitizing user inputs.

## 4. Scaling Challenges & Solutions

Scaling to 1M+ Users

| Challenge                       | Solution                                                                        |
|---------------------------------|---------------------------------------------------------------------------------|
| Increased API traffic           | Use load balancers to distribute requests across multiple Next.js API instances |
| Database bottleneck             | Implement read replicas & partitioning in PostgreSQL                            |
| Slow queries                    | Optimize indexes and use Redis caching                                          |
| Increased background processing | Offload AI sentiment analysis to background workers with Celery                 |

Potential Bottlenecks & Fixes
- **Database Overload:** Implement query optimization, indexing, and sharding.
- **Authentication Scaling:** Offload authentication to external providers like Auth0.
- **Storage Costs:** Move old journal entries to cold storage (e.g., AWS S3).

## 5. Components That Might Need Redesign at Scale
- **API Layer:** Convert from monolithic Next.js API to microservices.
- **Data Storage:** Use a hybrid SQL + NoSQL model for faster retrieval.
- **Event Processing:** Implement Kafka for real-time processing of user actions.

## Conclusion
The Emberlog system is designed to handle user journaling with AI-driven insights. With a combination of PostgreSQL,
and AI-powered analysis.