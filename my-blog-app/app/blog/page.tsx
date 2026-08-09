import Link from "next/link"
import { prisma } from "@/lib/prisma"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  author: {
    name: string
  } | null
  createdAt: Date
}

export default async function BlogPage(){
    const posts = await prisma.post.findMany({
        where:{published:true},
        orderBy:{createdAt:"desc"},
        include:{
            author:{
                select:{
                    name:true,
                },
            },
        },
    })

    return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Posts</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post:Post) => (
            <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold hover:text-blue-600 mb-2">
                  {post.title}
                </h2>
              </Link>
              <div className="text-sm text-gray-500 mb-2">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {post.author && ` • By ${post.author.name}`}
              </div>
              <p className="text-gray-700">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block mt-3 text-blue-600 hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}