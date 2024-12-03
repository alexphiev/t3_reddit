'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ChevronsUpDown, Home, LogIn, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

export function AppSidebar() {
  const pathname = usePathname()
  const user = {
    name: 'John Doe',
    email: 'john@doe.com',
    avatar: 'https://github.com/shadcn.png',
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="home">
                <SidebarMenuButton asChild>
                  <Link
                    className={pathname === '/' ? 'text-primary' : ''}
                    href="/"
                  >
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SignedOut>
                <SidebarMenuItem key="login">
                  <SidebarMenuButton asChild>
                    <Link
                      className={pathname === '/sign-in' ? 'text-primary' : ''}
                      href="/sign-in"
                    >
                      <LogIn />
                      <span>Login</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedOut>
              <SignedIn>
                <SidebarMenuItem key="my-posts">
                  <SidebarMenuButton asChild>
                    <Link
                      className={pathname === '/my-posts' ? 'text-primary' : ''}
                      href="/my-posts"
                    >
                      <MessageCircle />
                      <span>My Posts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedIn>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SignedIn>
        <SidebarFooter className="border-t p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <SidebarMenuButton>
                      <User />
                      Account
                    </SidebarMenuButton>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <SignOutButton>
                    <SidebarMenuButton>
                      <LogOut />
                      Log out
                    </SidebarMenuButton>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SignedIn>
    </Sidebar>
  )
}
