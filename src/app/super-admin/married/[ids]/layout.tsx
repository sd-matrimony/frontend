import MarriedPairLayout from "@/components/admin/married-pair/layout";

function Layout({ children }: LayoutProps<"/super-admin/married/[ids]">) {
  return (
    <MarriedPairLayout role="super-admin">
      {children}
    </MarriedPairLayout>
  )
}

export default Layout
