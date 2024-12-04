import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { currentUser } from '@clerk/nextjs/server'
import { type Prisma } from '@prisma/client'
import { format } from 'timeago.js'
import { VoteButtons } from './VoteButtons'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface PostListProps {
  posts: Prisma.PostGetPayload<{ include: { author: true } }>[]
}

export async function PostList({ posts }: PostListProps) {
  const user = await currentUser()

  return (
    <div className="flex w-full justify-center">
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        {posts?.map((post, index) => {
          const { id, author, createdAt, title, content } = post
          return (
            <div key={id}>
              <Card
                key={id}
                className="w-full overflow-hidden border-none shadow-none"
              >
                <div className="flex">
                  <VoteButtons userId={user?.id} postId={id} />

                  {/* Post content */}
                  <div className="flex-1">
                    <CardHeader className="p-4 pb-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          {author?.imageUrl && (
                            <AvatarImage
                              src={author.imageUrl}
                              alt="Author avatar"
                            />
                          )}
                          <AvatarFallback className="text-xs">
                            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                            {author.firstName?.[0]}
                            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                            {author.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-normal text-gray-600">
                          Posted by {author.firstName} {author.lastName}{' '}
                          {format(createdAt)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <Link href={`/post/${id}`}>
                        <h2 className="mb-2 text-base font-medium hover:text-primary">
                          {title}
                        </h2>
                      </Link>
                      <p className="line-clamp-6 text-sm font-normal text-muted-foreground">
                        {content}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
              {index < posts.length - 1 && (
                <Separator className="my-5 opacity-80" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
