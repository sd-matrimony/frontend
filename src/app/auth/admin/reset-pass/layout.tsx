import ResetPassLayout from '@/components/auth/reset-pass/layout';

function Layout({ children }: LayoutProps<"/auth/admin/reset-pass">) {
  return (
    <ResetPassLayout>
      {children}
    </ResetPassLayout>
  )
}

export default Layout
