import Footer from "@/components/home/footer";
import Nav from "@/components/home/nav";

function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}

export default Layout
