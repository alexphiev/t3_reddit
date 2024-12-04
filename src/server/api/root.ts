import { postRouter } from '@/server/api/routers/post.router'
import { postVoteRouter } from '@/server/api/routers/post-vote.router'
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'
import { commentVoteRouter } from './routers/comment-vote.router'
import { commentRouter } from './routers/comment.router'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  postVote: postVoteRouter,
  commentVote: commentVoteRouter,
  comment: commentRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
