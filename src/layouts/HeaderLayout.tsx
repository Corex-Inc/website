import type { ReactNode } from "react"
import { Outlet } from "react-router-dom";
import { Header } from "@/widgets/Header"

interface HeaderLayoutProps {
  children?: ReactNode;
}

function HeaderLayout({ children }: HeaderLayoutProps) {
  return (
    <div className="header-layout">
      <Header />

      <main>
        {children || <Outlet />}
      </main>
    </div>
  )
}

export { HeaderLayout };