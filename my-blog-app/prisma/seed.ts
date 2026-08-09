import "dotenv/config"
import {PrismaClient} from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import bcrypt from "bcryptjs"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({adapter})

async function main(){
     console.log('🌱 Seeding database...')

     const adminPassword = await bcrypt.hash("admin123",12)
     const admin = await prisma.user.upsert({
        where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      name: 'Admin User',
      password: adminPassword,
    },
     })

     // Create demo user
  const demoPassword = await bcrypt.hash('password123', 12)
  const demo = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: demoPassword,
    },
  })

  console.log(`✅ Created users: ${admin.name}, ${demo.name}`)

  // Sample posts
  const posts = [
    {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      content: `# Getting Started with Next.js 14

Next.js 14 is amazing! Here's why you should use it.

## Features
- Server Components
- App Router
- Fast Refresh
- Built-in API routes

## Why I love it
It makes building React apps so much easier!`,
      excerpt: 'Learn why Next.js 14 is the best framework for React development.',
      tags: JSON.stringify(['nextjs', 'react', 'webdev']),
      published: true,
      authorId: admin.id,
    },
    {
      title: 'My Journey with TypeScript',
      slug: 'my-journey-with-typescript',
      content: `# My Journey with TypeScript

TypeScript has changed how I write JavaScript forever.

## Benefits
- Type safety
- Better IDE support
- Catches errors early
- Self-documenting code

## Tips for beginners
Start small and gradually add types.`,
      excerpt: 'How TypeScript improved my development workflow and code quality.',
      tags: JSON.stringify(['typescript', 'javascript', 'programming']),
      published: true,
      authorId: admin.id,
    },
    {
      title: 'Mastering Tailwind CSS',
      slug: 'mastering-tailwind-css',
      content: `# Mastering Tailwind CSS

Tailwind makes styling fun again!

## Why Tailwind?
- Utility-first approach
- No context switching
- Highly customizable
- Great performance

## Pro tip
Use the @apply directive for reusable components.`,
      excerpt: 'Everything you need to know about Tailwind CSS in one guide.',
      tags: JSON.stringify(['tailwind', 'css', 'design']),
      published: true,
      authorId: demo.id,
    },
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  console.log(`✅ Created ${posts.length} sample posts`)
  console.log('\n👤 Default users:')
  console.log('  Admin: admin@blog.com / admin123')
  console.log('  Demo:  demo@example.com / password123')
}

main()
.catch((e)=>{
    console.error('❌ Error:', e)
    process.exit(1)
})
.finally(async()=>{
    await prisma.$disconnect()
})