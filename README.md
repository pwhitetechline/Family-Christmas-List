# Family Christmas List Application

A collaborative Christmas gift list manager built with Astro, React, and Prisma.

## Features

- Create and manage personal wishlists
- Mark items as purchased to avoid duplicates
- Share lists with family members
- Support for multiple family groups
- Privacy controls for list viewing
- Real-time updates
- Responsive, festive design

## Tech Stack

- **Frontend:** Astro, React, TailwindCSS
- **Backend:** Astro API endpoints
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Auth.js
- **Styling:** TailwindCSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Initialize the database:
   ```bash
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
```

## Contributing

Feel free to submit issues and enhancement requests!
