import Navbar from "@/components/navbar";

function Layout({ children }: LayoutProps<"/super-admin">) {
  return (
    <main>
      <Navbar role="super-admin" />
      {children}
    </main>
  )
}

export default Layout
