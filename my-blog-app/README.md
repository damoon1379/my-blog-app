# 📝 Full-Stack Blog Application

A complete blog platform built with Next.js 15, PostgreSQL, and Prisma. Features user authentication, post management, and a clean responsive interface.

## ✨ Features

- 🔐 **Authentication**: Sign up, Sign in, Sign out with NextAuth.js
- 📝 **Post Management**: Create, Read, Update, Delete blog posts
- 🏷️ **Tags**: Add and manage post tags
- 📊 **Dashboard**: Full control over all your posts
- 👁️ **View Counter**: Track post popularity
- 📱 **Responsive**: Works on all device sizes
- 🎨 **Modern UI**: Clean design with Tailwind CSS
- 🔒 **Protected Routes**: Secure dashboard and post management

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon / Supabase / Local)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel / Railway

## 🌐 Live demo:

**Visit the live site:** https://my-blog-hoaksil1o-damoon1379s-projects.vercel.app
## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (see options below)
- npm or yarn

### 1. Clone the Repository

### 2. Install Dependencies

npm install

### 3. Set Up Environment Variables

- create .env file
- Open .env and add your configuration:
  # Database URL 
  DATABASE_URL="your-database-connection-string"

  # Authentication
  NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
  NEXTAUTH_URL="http://localhost:3000"

### 4. Set Up the Database

ypu can pick options such as: neon,supabase or local postgreSQL 
i used supabase for this project's development, after creating a project on supabase add the following 
line in .env file:
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

### 5. Initialize the Database

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run db:seed

### 6. Start the Development Server

npm run dev

