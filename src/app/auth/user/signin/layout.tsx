import SigninLayout from '@/components/auth/signin/layout';

function Layout({ children }: LayoutProps<"/auth/user/signin">) {
  return (
    <SigninLayout>
      {children}
    </SigninLayout>
  )
}

export default Layout
