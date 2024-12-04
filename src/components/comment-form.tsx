'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { type ClientUser } from '@/types/user.types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AutosizeTextarea } from './ui/autosize-textarea'
import { Card } from './ui/card'
import { Separator } from './ui/separator'

interface CommentFormProps {
  user: ClientUser | null
  parentId?: string
  postId: string
  onComment?: () => void
}

export function CommentForm({
  user,
  parentId,
  postId,
  onComment,
}: CommentFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')

  const createComment = api.comment.create.useMutation({
    onSuccess: () => {
      void router.refresh()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createComment.mutate({
      content,
      replyToId: parentId ?? null,
      postId,
      authorId: user?.id ?? '',
    })

    setContent('')
    onComment?.()
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <Avatar className="h-8 w-8">
          {user?.imageUrl && (
            <AvatarImage src={user.imageUrl} alt="User avatar" />
          )}
          <AvatarFallback>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-2">
          <AutosizeTextarea
            minHeight={10}
            maxHeight={50}
            placeholder="Comment your thoughts"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none border-none p-0 text-sm font-normal placeholder:text-gray-500 focus-visible:ring-0"
          />
          <Separator orientation="horizontal" />
          <Button type="submit" className="self-end">
            Comment
          </Button>
        </div>
      </form>
    </Card>
  )
}
