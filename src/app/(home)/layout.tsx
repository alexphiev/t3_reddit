import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex w-full">
        <SidebarTrigger />
        <div className="flex w-full justify-center">
          <div className="w-full justify-start py-4 md:py-8 lg:w-[600px]">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
