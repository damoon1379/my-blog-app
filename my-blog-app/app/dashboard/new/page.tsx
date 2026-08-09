"use client"

import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import {useEffect} from "react"
import PostEditor from "@/components/PostEditor"

export default function NewPostPage(){
    const router = useRouter()
    const{data:session,status} = useSession()

    useEffect(()=>{
        if(status==="unauthenticated"){
            router.push("/auth/signin")
        }
        },[status,router])

        if(status==="loading"){
            return( 
            <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading...</div>
            </div>
            )
        }
        if(!session){
            return null
        }
const handleSave = async (postData:{
    title:string,
    content:string,
    tags:string[],
    excerpt:string,
    published:boolean,
})=>{
    try{
        const res = await fetch("/api/posts",{
            method:"POST",
            headers:{
            "Content-Type":"application/json",
            },
            body:JSON.stringify(postData)
        })

        if(res.ok){
            router.push("/dashboard")
            router.refresh()
        }else{
            const error = await res.json()
            alert(error.error||"Failed to create post")
        }
    }catch(error){
        console.error("Error creating post: ",error)
        alert("Failed to create post")
    }
}
     return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostEditor onSave={handleSave} />
    </div>
  )
}