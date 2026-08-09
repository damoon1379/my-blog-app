import {NextResponse} from "next/server"
import {prisma} from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

//Get all posts (public)
export async function GET() {
    try{
        const posts = await prisma.post.findMany({
            where:{published:true},
            include:{
                author:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        return NextResponse.json(posts)
    }catch(error){
        console.error("Error fetching posts: ",error)
        return NextResponse.json(
            {error:"Failed to fetch posts"},
            {status: 500}
        )
    }
}

//Create a new post (authenticated)
export async function POST(request:Request){
    try{
        const session = await getServerSession(authOptions)

        if(!session?.user?.email){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            )
        }

        const {title,content,excerpt,published,tags} = await request.json()
        if(!title || !content){
            return NextResponse.json(
                {error:"Title and Content are required"},
                {status: 400}
            )
        }

        const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")

      //Check if slug exists
      const existingPost = await prisma.post.findUnique({
        where:{slug}
      })
      if(existingPost){
        return NextResponse.json(
            {error:"A post with this title already exists"},
            {status:400}
        )
      }

      //Get the author
      const author = await prisma.user.findUnique({
        where:{email:session.user.email}
      })

      if(!author){
        return NextResponse.json(
            {error:"Author not found"},
            {status:404},
        )
      }

       const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
        tags: tags ? JSON.stringify(tags) : null,
        published: published || false,
        authorId: author.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    return NextResponse.json(post,{status:201})
    }catch(error){
        console.error("Error creatinf the post: ",error)
        return NextResponse.json(
            {error:"Failed to create the post"},
            {status:500}
        )
    }
}