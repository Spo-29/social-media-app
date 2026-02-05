# Social Media App

A full-stack social media application built with React and Node.js, using Microsoft SQL Server as the database.

## Features

- User authentication and registration
- Create and view posts
- Comment system
- Stories feature
- User profiles
- Dark mode support
- Real-time updates

## Tech Stack

### Frontend

- React
- SCSS for styling
- Context API for state management

### Backend

- Node.js
- Express.js
- MSSQL (Microsoft SQL Server)
- Windows Authentication

## Project Structure

```
├── api/               # Backend API server
├── client/            # React frontend application
└── database/          # SQL database scripts
```

## Setup Instructions

### Prerequisites

- Node.js and npm/yarn installed
- SQL Server (Express or higher) installed
- SQL Server Management Studio (SSMS) recommended
- SQL Server ODBC driver (msnodesqlv8)

### Database Setup

#### Step 1: Create Database in SQL Server

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance (e.g., `LAPTOP-NAME\SQLEXPRESS`)
3. Click "New Query"
4. Create the database:
   ```sql
   CREATE DATABASE db_project;
   GO
   ```
5. Execute the query (F5 or click Execute)

#### Step 2: Run Database Schema Script

1. In SSMS, open the `database/creates.sql` file from this project
2. Make sure `db_project` is selected in the database dropdown
3. Execute the entire script to create all tables:
   - **users** - User accounts and profiles
   - **posts** - User posts/updates
   - **comments** - Comments on posts
   - **stories** - User stories
   - **relationships** - Follow/follower connections
   - **likes** - Post likes

The script will also create a trigger (`TRG_DeleteUser_Cleanup`) to handle cascading deletes properly.

#### Step 3: Verify Database Setup

Run this query to verify all tables were created:

```sql
SELECT name FROM sys.tables ORDER BY name;
```

You should see: comments, likes, posts, relationships, stories, users

#### Step 4: Configure Backend Connection

1. Open `api/connect.js`
2. Update the server name if needed:
   ```javascript
   server: "YOUR-COMPUTER-NAME\\SQLEXPRESS";
   ```
3. Verify the database name matches:
   ```javascript
   database: "db_project";
   ```

**Note:** The app uses Windows Authentication (Integrated Security), so no username/password is needed.

### Backend Setup

1. Navigate to the api folder:

   ```bash
   cd api
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Update database configuration in `connect.js` if needed (server name, database name)

4. Start the server:
   ```bash
   yarn start
   ```

The API will run on `http://localhost:8800`

### Frontend Setup

1. Navigate to the client folder:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

The app will open at `http://localhost:3000`

## API Features

- MySQL-style parameterized queries with `?` placeholders
- Automatic conversion to MSSQL named parameters
- Connection pooling for better performance

## License

MIT
