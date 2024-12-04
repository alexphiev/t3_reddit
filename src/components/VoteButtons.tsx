'use client'

import { ChevronDown } from 'lucide-react'

import { api } from '@/trpc/react'
import { ChevronUp } from 'lucide-react'
import { Button } from './ui/button'

interface VoteButtonsProps {
  userId?: string
  postId: string
}

export function VoteButtons({ userId, postId }: VoteButtonsProps) {
  const utils = api.useUtils()
  const { data: votes, isLoading } = api.postVote.getByPostId.useQuery({
    postId,
  })

  const upvote = api.postVote.upvote.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      void utils.postVote.getByPostId.invalidate({ postId })
    },
  })
  const downvote = api.postVote.downvote.useMutation({
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      void utils.postVote.getByPostId.invalidate({ postId })
    },
  })

  const hasVotedUp = userId
    ? votes?.some((vote) => vote.userId === userId && vote.value === 1)
    : false
  const hasVotedDown = userId
    ? votes?.some((vote) => vote.userId === userId && vote.value === -1)
    : false

  const count = votes?.reduce((acc, vote) => acc + vote.value, 0) ?? 0

  return (
    <div className={`flex flex-col items-center p-2 md:p-4`}>
      <Button
        size="icon"
        variant={'ghost'}
        className={`h-8 w-8 ${hasVotedUp ? 'text-primary' : ''}`}
        disabled={isLoading || !userId}
        onClick={() => {
          if (userId) {
            upvote.mutate({ userId, postId })
          }
        }}
      >
        <ChevronUp className="h-5 w-5" strokeWidth={hasVotedUp ? 5 : 2} />
      </Button>
      <span className="py-1 text-sm font-medium">
        {isLoading ? '...' : count}
      </span>
      <Button
        size="icon"
        variant={'ghost'}
        className={`h-8 w-8 ${hasVotedDown ? 'text-primary' : ''}`}
        disabled={isLoading || !userId}
        onClick={() => {
          if (userId) {
            downvote.mutate({ userId, postId })
          }
        }}
      >
        <ChevronDown className="h-5 w-5" strokeWidth={hasVotedDown ? 5 : 2} />
      </Button>
    </div>
  )
}
