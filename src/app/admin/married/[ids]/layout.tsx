import MarriedPairLayout from "@/components/admin/married-pair/layout";

function Layout({ children }: LayoutProps<"/admin/married/[ids]">) {
  return (
    <MarriedPairLayout role="admin">
      {children}
    </MarriedPairLayout>
  )
}

export default Layout
