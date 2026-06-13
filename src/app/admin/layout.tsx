import Navbar from "@/components/navbar";

function Layout({ children }: LayoutProps<"/admin">) {
  return (
    <main>
      <Navbar role="admin" />
      {children}
    </main>
  )
}

export default Layout
