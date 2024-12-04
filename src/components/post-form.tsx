'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AutosizeTextarea } from './ui/autosize-textarea'
import { Separator } from './ui/separator'
import { z } from 'zod'

interface PostFormProps {
  userId: string
  userImageUrl?: string | null
}

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content is too long'),
})

export function PostForm({ userId, userImageUrl }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      setTitle('')
      setContent('')
      router.refresh()
    },
    onError: (error) => {
      console.error('Failed to create post:', error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validated = postSchema.parse({ title, content })
      setErrors({})
      createPost.mutate({
        authorId: userId,
        title: validated.title,
        content: validated.content,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              {userImageUrl && (
                <AvatarImage src={userImageUrl} alt="User avatar" />
              )}
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-3 text-xl">
              <div>
                <AutosizeTextarea
                  minHeight={10}
                  maxHeight={50}
                  placeholder="Title of your post"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setTitle(e.target.value)
                  }
                  className={`resize-none border-none p-0 text-base font-normal placeholder:text-gray-500 focus-visible:ring-0 ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              <div>
                <AutosizeTextarea
                  minHeight={10}
                  maxHeight={200}
                  placeholder="Share your thoughts with the world!"
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContent(e.target.value)
                  }
                  className={`border-none p-0 text-base font-normal placeholder:text-gray-500 focus-visible:ring-0 ${
                    errors.content ? 'border-red-500' : ''
                  }`}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                )}
              </div>
              <Separator className="opacity-80" />
            </div>
          </div>
          <Button type="submit" size="lg" className="self-end">
            Post
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
