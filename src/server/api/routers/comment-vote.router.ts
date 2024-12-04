import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

export const commentVoteRouter = createTRPCRouter({
  upvote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has already voted
      const existingVote = await ctx.db.commentVote.findFirst({
        where: {
          userId: input.userId,
          commentId: input.id,
        },
      })

      if (existingVote) {
        // Delete vote if it exists and is already upvoted
        if (existingVote.value === 1) {
          // Remove vote
          await ctx.db.commentVote.delete({
            where: {
              id: existingVote.id,
            },
          })
          return { action: 'removed' }
        }

        // Update vote if it exists with a downvote
        await ctx.db.commentVote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            value: 1,
          },
        })
        return { action: 'updated' }
      }

      // Create new vote
      await ctx.db.commentVote.create({
        data: {
          userId: input.userId,
          commentId: input.id,
          value: 1,
        },
      })
      return { action: 'added' }
    }),

  downvote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has already voted
      const existingVote = await ctx.db.commentVote.findFirst({
        where: {
          userId: input.userId,
          commentId: input.id,
        },
      })

      if (existingVote) {
        // Delete vote if it exists and is already downvoted
        if (existingVote.value === -1) {
          await ctx.db.commentVote.delete({
            where: {
              id: existingVote.id,
            },
          })
          return { action: 'removed' }
        }

        // Update vote if it exists with an upvote
        await ctx.db.commentVote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            value: -1,
          },
        })
        return { action: 'updated' }
      }

      // Create new vote
      await ctx.db.commentVote.create({
        data: {
          userId: input.userId,
          commentId: input.id,
          value: -1,
        },
      })
      return { action: 'added' }
    }),

  getByCommentId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.commentVote.findMany({
        where: { commentId: input.id },
      })
    }),
})
