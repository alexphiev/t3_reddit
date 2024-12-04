import { env } from '@/env'
import { db } from '@/server/db'
import { type WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

export async function POST(req: Request) {
  console.log('Received webhook from Clerk')
  const SIGNING_SECRET = env.CLERK_WEBHOOK_SECRET

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = (await req.json()) as unknown as WebhookEvent

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  const { id } = evt.data
  const eventType = evt.type
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  console.log('Webhook payload:', JSON.stringify(payload, null, 2))

  switch (eventType) {
    case 'user.created':
      try {
        const { first_name, last_name, email_addresses, id } = evt.data

        if (!email_addresses?.[0]) {
          throw new Error('Incomplete user data: No email addresses found')
        }

        // Create a user in the database
        const user = await db.user.create({
          data: {
            id: id,
            firstName: first_name,
            lastName: last_name,
            username: email_addresses[0].email_address,
          },
        })
        console.log('New user created:', user)
      } catch (error) {
        console.error('Failed to create user:', error)
        return new Response('Error: Failed to create user', {
          status: 500,
        })
      }
      break
  }

  return new Response('Webhook received', { status: 200 })
}
