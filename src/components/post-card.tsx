import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type Prisma } from '@prisma/client'
import Link from 'next/link'
import { format } from 'timeago.js'
import { VoteButtons } from './vote-buttons'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Prisma.PostGetPayload<{ include: { author: true } }>
  userId?: string | null
  lineClamp?: number
  previousUrl?: string
}

export function PostCard({
  post,
  userId,
  lineClamp,
  previousUrl,
}: PostCardProps) {
  const { id, author, createdAt, title, content } = post

  return (
    <Card className="w-full overflow-hidden border-none shadow-none">
      <div className="flex">
        <VoteButtons userId={userId ?? undefined} id={id} type="post" />

        {/* Post content */}
        <div className="flex-1">
          <CardHeader className="p-4 pb-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                {author?.imageUrl && (
                  <AvatarImage src={author.imageUrl} alt="Author avatar" />
                )}
                <AvatarFallback className="text-xs">
                  {author.firstName?.[0]}
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
            <Link
              href={{
                pathname: `/posts/${id}`,
                query: { previousUrl },
              }}
            >
              <h2 className="mb-2 text-base font-medium hover:text-primary">
                {title}
              </h2>
            </Link>
            <p
              className={cn(
                'text-sm font-normal text-muted-foreground',
                lineClamp && `line-clamp-${lineClamp}`
              )}
            >
              {content}
            </p>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
