import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

export const postVoteRouter = createTRPCRouter({
  upvote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has already voted
      const existingVote = await ctx.db.postVote.findFirst({
        where: {
          userId: input.userId,
          postId: input.postId,
        },
      })

      if (existingVote) {
        // Delete vote if it exists and is already upvoted
        if (existingVote.value === 1) {
          // Remove vote
          await ctx.db.postVote.delete({
            where: {
              id: existingVote.id,
            },
          })
          return { action: 'removed' }
        }

        // Update vote if it exists with a downvote
        await ctx.db.postVote.update({
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
      await ctx.db.postVote.create({
        data: {
          userId: input.userId,
          postId: input.postId,
          value: 1,
        },
      })
      return { action: 'added' }
    }),

  downvote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has already voted
      const existingVote = await ctx.db.postVote.findFirst({
        where: {
          userId: input.userId,
          postId: input.postId,
        },
      })

      if (existingVote) {
        // Delete vote if it exists and is already downvoted
        if (existingVote.value === -1) {
          await ctx.db.postVote.delete({
            where: {
              id: existingVote.id,
            },
          })
          return { action: 'removed' }
        }

        // Update vote if it exists with an upvote
        await ctx.db.postVote.update({
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
      await ctx.db.postVote.create({
        data: {
          userId: input.userId,
          postId: input.postId,
          value: -1,
        },
      })
      return { action: 'added' }
    }),

  getByPostId: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.postVote.findMany({
        where: { postId: input.postId },
      })
    }),
})
