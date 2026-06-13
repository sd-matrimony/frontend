import UserDetailsLayout from "@/components/admin/user-details/layout";

function Layout({ children }: LayoutProps<"/super-admin/user/[id]">) {
  return (
    <UserDetailsLayout role="super-admin">
      {children}
    </UserDetailsLayout>
  )
}

export default Layout
