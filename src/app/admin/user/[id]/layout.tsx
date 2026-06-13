import UserDetailsLayout from "@/components/admin/user-details/layout";

function Layout({ children }: LayoutProps<"/admin/user/[id]">) {
  return (
    <UserDetailsLayout role="admin">
      {children}
    </UserDetailsLayout>
  )
}

export default Layout
