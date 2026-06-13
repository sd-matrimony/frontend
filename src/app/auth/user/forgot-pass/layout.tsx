import ForgotPassLayout from '@/components/auth/forgot-pass/layout';

function Layout({ children }: LayoutProps<"/auth/user/forgot-pass">) {
  return (
    <ForgotPassLayout>
      {children}
    </ForgotPassLayout>
  )
}

export default Layout
