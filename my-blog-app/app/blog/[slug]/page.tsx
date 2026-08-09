import { notFound } from "next/navigation";
import Link from "next/link"
import {prisma} from "@/lib/prisma"

interface PageProps{
    params: Promise<{
        slug:string
    }>
}

export default async function PostPage({params}:PageProps){
    const {slug} = await params
    const post = await prisma.post.findUnique({
        where:{slug},
        include:{
            author:{
                select:{
                    name:true,
                },
            },
        },
    })
    if(!post || !post.published){
        notFound()
    }

    //increment views
    await prisma.post.update({
        where:{id: post.id},
        data:{views:{increment:1}}
    })

    //parse tags if they exist
    const tags = post.tags ? JSON.parse(post.tags) : []

    return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to all posts
      </Link>

      <article>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-sm text-gray-500 mb-6">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {post.author && ` • By ${post.author.name}`}
          <span className="ml-4">👁️ {post.views} views</span>
        </div>

        {tags.length > 0 && (
          <div className="flex gap-2 mb-6">
            {tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  )
}