import Navbar from "@/components/navbar";

function Layout({ children }: LayoutProps<"/user">) {
  return (
    <main>
      <Navbar role="user" />
      {children}
    </main>
  )
}

export default Layout
