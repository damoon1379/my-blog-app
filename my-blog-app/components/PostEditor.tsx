"use client"
import React, { useState } from "react"
import {useEditor, EditorContent} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import {useRouter} from "next/navigation"

interface PostEditorProps {
    initialTitle?: string,
    initialContent?: string,
    initialExcerpt?:string,
    initialTags?:string[],
    isEditing?: boolean,
    onSave:(data:{title:string,excerpt:string,content:string,tags:string[],published:boolean,plainText:string})=>void
}

export default function PostEditor({
    initialTitle="",
    initialContent="",
    initialExcerpt="",
    initialTags=[],
    onSave,
    isEditing = false
}:PostEditorProps){
    const [title, setTitle] = useState(initialTitle)
    const [excerpt,setExcerpt] = useState(initialExcerpt)
    const [content,setContent] = useState(initialContent)
    const [tags,setTags] = useState<string[]>(initialTags)
    const [tagInput,setTagInput] = useState("")
    const [isPublished,setIsPublished] = useState(false)
    const router = useRouter()

    const editor = useEditor({
        extensions:[
            StarterKit,
            Placeholder.configure({
                placeholder:"Write your post content here..."
            })
        ],
        content:initialContent,
    })

    const handleAddTag = (e:React.KeyboardEvent)=>{

        if(e.key === "Enter" && tagInput.trim()){
        e.preventDefault()
            if(!tags.includes(tagInput.trim())){
                setTags([...tags,tagInput.trim()])
            }
            setTagInput("")
        }
    }

    const removeTag=(tagToRemove:string)=>{
        setTags(tags.filter((tag)=>tag !== tagToRemove))
    }

const stripHtml = (html: string) => {
  if (typeof window === 'undefined') return html
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}
    const handleSubmit = (e:any)=>{
        e.preventDefault()
        const htmlContent = editor?.getHTML() || ""
        const plainText = stripHtml(htmlContent)
        onSave({
            title,
            content:plainText,
            plainText:plainText,
            tags,
            published:isPublished,
            excerpt: excerpt || plainText.replace(/<[^>]*>/g,"").slice(0,150)+"...",
        })
    }

    return(
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="text-4xl font-bold w-full border-0 focus:ring-0 focus:outline-none placeholder-gray-300"
          required
        />
      </div>

      {/* Tags Input */}
      <div className="flex flex-wrap gap-2 items-center p-2 border rounded-lg">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 ml-1"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags (press Enter)"
          className="flex-1 min-w-[120px] border-0 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Excerpt Input */}
      <div>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Post excerpt (optional)"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      {/* Editor */}
      <div className="border rounded-lg p-4 min-h-[400px]">
        <EditorContent 
          editor={editor} 
          className="prose max-w-none focus:outline-none min-h-[350px]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 items-center pt-4 border-t">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isEditing ? "Update Post" : "Create Post"}
        </button>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4"
          />
          Publish immediately
        </label>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      <div className="text-sm text-gray-500">
        <p>ℹ️ Your post will be saved with these tags: {tags.join(", ") || "none"}</p>
      </div>
    </form>
  )
}