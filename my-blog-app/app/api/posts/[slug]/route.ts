import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"
import {getServerSession} from "next-auth"
import {authOptions} from "../../auth/[...nextauth]/route"

//Fetch a single post by slug
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){
    try{
        const {slug} = await params
        const post = await prisma.post.findUnique({
            where:{slug:slug},
            include:{
                author:{
                    select:{
                        name:true,
                        id:true,
                        email:true
                    }
                }
            }
        })

        if(!post){
            return NextResponse.json(
                {error:"Post not found: "},
                {status:404}
            )
        }
        if(post.published){
            await prisma.post.update({
                where:{slug:slug},
                data:{views:{increment:1}}
            })
        }
        return NextResponse.json(post)
    }catch(error){
        console.error("Error fetching post: ",error)
        return NextResponse.json(
            {error:"Failed to fetch post"},
            {status:500}
        )
    }
}

//PUT-update an existing post
export async function PUT(request:Request,{params}:{params:Promise<{slug:string}>}){
    try{
        const {slug} = await params
        const session = await getServerSession(authOptions)

        //check if user is logged in
        if(!session?.user?.email){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            )
        }

        const {title,content,excerpt,tags,published} = await request.json()

        //find the existing post
        const post = await prisma.post.findUnique({
            where:{slug:slug},
            include:{
                author:true
            }
        })
        if(!post){
            return NextResponse.json(
                {error:"Post not found"},
                {status:404}
            )
        }
        
        //check if user is the author
        if(post.author.email !== session.user.email){
            return NextResponse.json(
                {error:"Unauthorized to edit this post"},
                {status:403}
            )
        }

        //generate new slug if title is changed
        let newSlug = slug
        if(title && title !== post.title){
            newSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "")
        }
        //check if new slug already exists
        if(newSlug !==slug){
            const existing = await prisma.post.findUnique({
                where:{slug:newSlug}
            })
            if(existing){
                return NextResponse.json(
                    {error:"A post with this title already exists"},
                    {status:400}
                )
            }
        }

        //update the post
        const updatedPost = await prisma.post.update({
            where:{slug:slug},
            data:{
                title: title || post.title,
                slug: newSlug || post.slug,
                content: content || post.content,
                excerpt: excerpt || post.excerpt,
                tags: tags ? JSON.stringify(tags) : post.tags,
                published: published !== undefined ? published : post.published
            },
            include:{
                author:{
                    select:{
                        name:true,
                        id:true,
                        email:true
                    }
                }
            }
        })
        return NextResponse.json(updatedPost)

    }catch(error){
        console.error("Error updating post: ",error)
        return NextResponse.json(
            {error:"Failed to update post"},
            {status:500}
        )
    }
}

//DELETE- delete a selected post
export async function DELETE(request:Request,{params}:{params:Promise<{slug:string}>}){
    try{
        const {slug} = await params
        //check if user is logged in 
        const session = await getServerSession(authOptions)
        if(!session?.user?.email){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            )
        }

        //find the post to delete
        const post = await prisma.post.findUnique({
            where:{slug:slug},
            include:{author:true}
        })
        if(!post){
            return NextResponse.json(
                {error:"Post not found"},
                {status:404}
            )
        }

        //check if user is the author of this post
        if(post.author.email !== session.user.email){
            return NextResponse.json(
                {error:"Unauthorized to delete this post"},
                {status:403}
            )
        }

        //delete the post
        await prisma.post.delete({
            where:{slug:slug}
        })
        return NextResponse.json({message:"Post deleted successfully"})
    }catch(error){
        console.error("Error deleting post: ",error)
        return NextResponse.json(
            {error:"Failed to delete post"},
            {status:500}
        )
    }
}