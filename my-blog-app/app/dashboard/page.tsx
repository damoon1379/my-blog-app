"use client"

import {useState,useEffect} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {useSession} from "next-auth/react"

interface Post{
    id:string,
    title:string,
    slug:string,
    published:boolean,
    views:number,
    createdAt:string
}

export default function Dashboard(){
    const {data:session,status} = useSession()
    const [loading,setLoading] = useState(true)
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(()=>{
        if(status === "unauthenticated"){
            router.push("/auth/signin")
        }
    },[status,router])

    useEffect(()=>{
        if(session?.user){
            fetchPosts()
        }
    },[session])

    const fetchPosts = async ()=>{
        try{
            const res = await fetch("/api/posts/user")
            if(res.ok){
                const data = await res.json()
                setPosts(data)
            }
        }catch(error){
            console.error("Failed to fetch posts: ",error)
        }finally{
            setLoading(false)
        }
    }

    const deletePost = async (slug:string)=>{
        if(!confirm("Are you sure you want to delete this post?")) return

        try{
            const res = await fetch(`/api/posts/${slug}`,{
                method:"DELETE"
            })

            if(res.ok){
                setPosts(posts.filter((post)=>(post.slug !== slug)))
            }else{
                alert("Failed to delete post")
            }
        }catch(error){
            console.error("Error deleting post", error)
            alert("Failed to delete post")
        }

    }
    if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          href="/dashboard/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500 mb-4">You haven't written any posts yet.</p>
          <Link
            href="/dashboard/new"
            className="text-blue-600 hover:underline"
          >
            Write your first post →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-semibold hover:text-blue-600">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(post.createdAt).toLocaleDateString()} • {post.views} views
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        post.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/dashboard/edit/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.slug)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}