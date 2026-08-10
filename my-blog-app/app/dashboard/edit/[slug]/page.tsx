"use client"
import{useSession} from "next-auth/react"
import{useEffect,useState,use} from "react"
import dynamic from "next/dynamic"
import {useRouter} from "next/navigation"

const PostEditor = dynamic(
    ()=>import("@/components/PostEditor"),
    {
        ssr:false,
        loading:()=><div className="text-gray-500">Loading editor...</div>
    }
)

export default function EditPostPage({params}:{params:Promise<{slug:string}>}){
    const router = useRouter()
    const {data:session,status} = useSession()
    const [isMounted,setIsMounted] = useState(false)
    const [loading,setLoading] = useState(true)
    //const [post, setPost] = useState<any>()
    const [slug,setSlug] = useState<string | null>(null)
    const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isPublished, setIsPublished] = useState(false)

    useEffect(()=>{
        setIsMounted(true)
    },[])

    useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])
  
    useEffect(()=>{
                            
        const unwrapParams = async()=>{
            try{
                const unwrapped = await params
                setSlug(unwrapped.slug)

            }catch(error){
                console.error("Failed to unwrap params: ",error)
                router.push("/dashboard")
            }
        }

       unwrapParams()
    },[params,router])

    useEffect(()=>{
        if(session?.user && slug){
            console.log("fetchpost useeffect")
            fetchPost()
        }
    },[session,slug])

    const fetchPost = async()=>{
        try{
           
        const res = await fetch(`/api/posts/${slug}`)
        if(res.ok){
            const data = await res.json()
             setTitle(data.title || "")
             setContent(data.content || "")
             setExcerpt(data.excerpt || "")
             setTags(data.tags ? JSON.parse(data.tags) : [])
             setIsPublished(data.published || false)
           // setPost(data)
            
        }else{
            router.push("/dashboard")
        }
        }catch(error){
            console.error("Failed to fetch post: ",error)
            router.push("/dashboard")
        }finally{
            setLoading(false)
        }
        
    }

    const handleUpdate = async(postData:{
        title:string,
        content:string,
        excerpt:string,
        tags:string[],
        published:boolean
    })=>{
        try{
           
            const res = await fetch(`/api/posts/${slug}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(postData)
            })

            if(res.ok){
                router.push("/dashboard")
                router.refresh()
            }else{
                const error = await res.json()
                alert(error.error || "Failed to update post")
            }
        }catch(error){
            console.error("Error updating post: ",error)
            alert("Failed to update post")
        }
    }

    if(status === "loading" || loading || !isMounted){
        return(<div className="text-center py-12">Loading...</div>)
    }
    if(!session ){
        return null
    }

    //const tags = post.tags? JSON.parse(post.tags) : []

    return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostEditor
        initialTitle={title}
        initialContent={content}
        initialExcerpt={excerpt}        
        initialTags={tags}             
        onSave={handleUpdate}
        isEditing={true}
      />
    </div>
  )

}