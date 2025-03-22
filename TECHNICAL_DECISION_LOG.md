# Emberlog Technical Decision Log

## 1. Choosing Next.js as a Fullstack Framework

### Problem:

I wanted to build Emberlog as a performant and scalable journaling app while challenging myself to use Next.js in a
fullstack capacity.

### Options Considered:

Use Next.js as a frontend-only framework and build a separate backend (e.g., Flask, Express.js, Django).

Use a traditional full stack (Python-Django, PostgresQL, Redis).

Use Next.js as a fullstack framework with API routes.

### Chosen Approach:

I decided to use Next.js as a fullstack framework, handling both frontend and backend with API routes.

### Rationale:

Next.js allows for server-side rendering (SSR) and static site generation (SSG) for improved performance.

Simplifies deployment by keeping both frontend and backend in the same codebase.

Enables fine-grained control over API performance and caching.

### Trade-offs & Consequences:

Required learning and adapting to Next.js backend features.

Potential API performance limitations compared to dedicated backend frameworks.

## 2. Choosing Vanilla HTML & CSS Over MUI

### Problem:

Initially, I started with Material-UI (MUI) to speed up development, but I encountered several bottlenecks:

Customizing MUI components was cumbersome and required deep overrides.

Performance issues due to excessive CSS-in-JS rendering.

Bloated bundle size impacting load times.

### Options Considered:

Continue with MUI and work around the issues.

Use Tailwind CSS for faster utility-based styling.

Switch to vanilla HTML & CSS for full control.

### Chosen Approach:

I decided to switch to vanilla HTML and CSS for styling Emberlog.

### Rationale:

Provides full control over styles without unnecessary abstraction.

Eliminates dependency on a UI framework, reducing bundle size.

Simplifies debugging and maintenance.

### Trade-offs & Consequences:

Required extra effort to manually style components.

Slower initial development compared to using a pre-built UI library.

## 3. Summary View and Data Storage Strategy

### Problem:

How to efficiently generate and display analytical summaries (e.g., heatmaps, pie charts, bar graphs, word clouds)
without recalculating them repeatedly.

### Options Considered:

Compute summaries dynamically on each request.

Store precomputed summaries in the database.

### Chosen Approach:

Store summaries in the database.

### Rationale:

Reduces computational overhead and improves response times.

Enables historical analysis without recalculating past summaries.

### Trade-offs & Consequences:

Requires periodic background jobs or triggers to update summaries.

## 4. Authentication with NextAuth.js

### Problem:

The application required a secure and scalable authentication system that supports both session-based and token-based
authentication.

### Options Considered:

Implement custom JWT authentication with bcrypt for password hashing.

Use Firebase Authentication for an external solution.

Use NextAuth.js for built-in session handling.

### Chosen Approach:

I decided to use NextAuth.js with JWT-based authentication.

### Rationale:

Seamlessly integrates with Next.js API routes.

Supports multiple authentication providers.

Handles session management automatically.

### Trade-offs & Consequences:

Requires customization for finer-grained access control.

Limited built-in MFA support, requiring additional implementation.

## 5. AI-Powered Sentiment Analysis with Hugging Face

### Problem:

To provide users with insights into their journal entries, Emberlog needed an AI-powered sentiment analysis feature.

### Options Considered:

Use Google Cloud Natural Language API.

Implement a local machine learning model with TensorFlow or PyTorch.

Use the Hugging Face Inference API.

### Chosen Approach:

I chose Hugging Face's Inference API for sentiment analysis.

### Rationale:

Provides pre-trained models with high accuracy.

Avoids the overhead of training and hosting custom models.

Supports easy integration via API calls.

### Trade-offs & Consequences:

Introduces an external dependency (Hugging Face API availability and costs).

Slight latency due to API calls instead of local inference.

## Conclusion

These key technical decisions shaped Emberlog’s architecture, performance, and security. By selecting Next.js as a
fullstack framework, switching to vanilla HTML & CSS, storing data computed in the summary view, leveraging NextAuth.js, and
integrating AI-powered sentiment analysis, the project is well-positioned for scalability and usability.

