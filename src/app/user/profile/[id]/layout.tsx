import UserDetailsLayout from "@/components/admin/user-details/layout";

function Layout({ children }: LayoutProps<"/user/profile/[id]">) {
  return (
    <UserDetailsLayout role="user">
      {children}
    </UserDetailsLayout>
  )
}

export default Layout
