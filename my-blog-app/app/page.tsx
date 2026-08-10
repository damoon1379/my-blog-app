import Link from "next/link"
import {prisma} from "@/lib/prisma"

export const revalidate=0

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published:boolean
  author: {
    name: string
  } | null
  createdAt: Date
}

export default async function Home(){
  const posts = await prisma.post.findMany({
    where:{published:true},
    orderBy:{createdAt:"desc"},
    take:3,
    include:{
      author:{
        select:{
          name:true,
        },
      },
    },
  })

  return(
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/*Hero section*/}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to my blog</h1>
        <p className="text-xl text-gray-600">
          Thoughts on webdevelopment, technology and more.
        </p>
        <Link
        href="/blog"
        className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Read All Posts →
        </Link>
      </section>

      {/*latest posts*/}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        {posts.length === 0 ?(
          <p className="text-gray-500">No Posts yet. Check back soon!</p>
        ):(
          <div className="space-y-6">
            {posts.map((post: Post)=>(
              <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-2xl font-semibold hover:text-blue-600 mb-2">
                    {post.title}
                  </h3>
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
      </section>
    </main>
  )
}