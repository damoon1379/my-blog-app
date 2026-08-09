import {NextResponse} from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import {prisma} from "@/lib/prisma"

export async function GET(){
    try{
        const session = await getServerSession(authOptions)
        if(!session?.user?.email){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const user = await prisma.user.findUnique({
            where:{email:session.user.email}
        })

        if(!user){
            return NextResponse.json(
                {error:"User not found"},
                {status: 404}
            )
        }

        const posts = await prisma.post.findMany({
            where:{authorId:user.id},
            select:{
                id: true,
                title: true,
                slug: true,
                published: true,
                views: true,
                createdAt: true,
            }
        })
        return NextResponse.json(posts)
    }catch(error){
        console.error("Error fetching user posts: ", error)
        return NextResponse.json(
            {error: "Failed to fetch posts"},
            {status: 500}
        )
    }
}