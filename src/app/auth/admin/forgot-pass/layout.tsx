import ForgotPassLayout from '@/components/auth/forgot-pass/layout';

function Layout({ children }: LayoutProps<"/auth/admin/forgot-pass">) {
  return (
    <ForgotPassLayout role="admin">
      {children}
    </ForgotPassLayout>
  )
}

export default Layout
