'use client'

import { ChevronsDown, ChevronsUp } from 'lucide-react'

import { api } from '@/trpc/react'
import { Button } from './ui/button'

interface VoteButtonsProps {
  userId?: string
  id: string
  type: 'post' | 'comment'
}

export function VoteButtons({ userId, id, type }: VoteButtonsProps) {
  const utils = api.useUtils()

  const { data: votes, isLoading } =
    type === 'post'
      ? api.postVote.getByPostId.useQuery({ id })
      : api.commentVote.getByCommentId.useQuery({ id })

  const upvote =
    type === 'post'
      ? api.postVote.upvote.useMutation({
          onSuccess: () => {
            void utils.postVote.getByPostId.invalidate({ id })
          },
        })
      : api.commentVote.upvote.useMutation({
          onSuccess: () => {
            void utils.commentVote.getByCommentId.invalidate({ id })
          },
        })

  const downvote =
    type === 'post'
      ? api.postVote.downvote.useMutation({
          onSuccess: () => {
            void utils.postVote.getByPostId.invalidate({ id })
          },
        })
      : api.commentVote.downvote.useMutation({
          onSuccess: () => {
            void utils.commentVote.getByCommentId.invalidate({ id })
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
    <div
      className={`flex ${type === 'comment' ? 'flex-row gap-3 px-0 py-2' : 'flex-col gap-3 px-2 py-4'} items-center`}
    >
      <Button
        size="icon"
        variant={'ghost'}
        className={`h-3 w-3 ${hasVotedUp ? 'text-primary' : ''}`}
        disabled={isLoading || !userId}
        onClick={() => {
          if (userId) {
            upvote.mutate({ userId, id })
          }
        }}
      >
        <ChevronsUp className="h-3 w-3" strokeWidth={hasVotedUp ? 3 : 1} />
      </Button>

      <span className="w-4 py-0.5 text-center text-base font-medium">
        {isLoading ? '...' : count}
      </span>

      <Button
        size="icon"
        variant={'ghost'}
        className={`h-3 w-3 ${hasVotedDown ? 'text-primary' : ''}`}
        disabled={isLoading || !userId}
        onClick={() => {
          if (userId) {
            downvote.mutate({ userId, id })
          }
        }}
      >
        <ChevronsDown className="h-3 w-3" strokeWidth={hasVotedDown ? 3 : 1} />
      </Button>
    </div>
  )
}
