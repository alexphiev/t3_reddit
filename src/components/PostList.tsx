import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { currentUser } from '@clerk/nextjs/server'
import { type Prisma } from '@prisma/client'
import { format } from 'timeago.js'
import { VoteButtons } from './VoteButtons'
import Link from 'next/link'

interface PostListProps {
  posts: Prisma.PostGetPayload<{ include: { author: true } }>[]
}

export async function PostList({ posts }: PostListProps) {
  const user = await currentUser()

  return (
    <div className="flex w-full justify-center">
      <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-8">
        {posts?.map((post) => {
          const { id, author, createdAt, title, content } = post
          return (
            <Card
              key={id}
              className="w-full overflow-hidden border-none shadow-none"
            >
              <div className="flex">
                <VoteButtons userId={user?.id} postId={id} />

                {/* Post content */}
                <div className="flex-1">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        {user?.imageUrl && (
                          <AvatarImage
                            src={user.imageUrl}
                            alt="Author avatar"
                          />
                        )}
                        <AvatarFallback>
                          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                          {author.firstName?.[0]}
                          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                          {author.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        Posted by {author.firstName} {author.lastName}
                      </span>
                      <span>•</span>
                      <span>{format(createdAt)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <Link href={`/post/${id}`}>
                      <h2 className="mb-2 text-xl font-semibold hover:text-primary">
                        {title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground">{content}</p>
                  </CardContent>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
