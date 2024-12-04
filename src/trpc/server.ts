import 'server-only'

import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { cookies, headers } from 'next/headers'
import { cache } from 'react'

import { createCaller, type AppRouter } from '@/server/api/root'
import { createTRPCContext } from '@/server/api/trpc'
import { createQueryClient } from './query-client'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  return createTRPCContext({
    headers: new Headers({
      cookie: JSON.stringify(cookies()),
      'x-trpc-source': 'rsc',
    }),
    auth: getAuth(
      new NextRequest('https://notused.com', { headers: await headers() })
    ),
  })
})

const getQueryClient = cache(createQueryClient)
const caller = createCaller(createContext)

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
)
