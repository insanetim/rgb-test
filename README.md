# RGB Test Task

Project is developed according to the technical specifications located in the `docs` folder.

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set up Database

```bash
# Start PostgreSQL database using Docker Compose
cd backend
docker-compose up -d

# Wait for the database to be ready, then run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 3. (Optional) Seed Database

```bash
# Run the seed script to populate the database with sample data
cd backend
npx prisma db seed
```

### 4. Start Development Servers

```bash
# Start backend server (in one terminal)
cd backend
npm run start:dev

# Start frontend server (in another terminal)
cd frontend
npm run dev
```

### Application URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Environment Variables

Backend `.env` file should contain:

```
DATABASE_URL="postgresql://postgres_user:postgres_password@localhost:5432/postgres_db"
PORT=3001
CLIENT_URL=http://localhost:3000
```

Frontend `.env` file should contain:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Useful Scripts

**Backend:**

- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

**Frontend:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management

- `npx prisma studio` - Open Prisma Studio to view database
- `npx prisma migrate dev` - Create and apply new migrations
- `npx prisma generate` - Regenerate Prisma client
- `docker-compose down` - Stop and remove PostgreSQL container
