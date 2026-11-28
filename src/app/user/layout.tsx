import Navbar from "@/components/navbar";
import { PlanExpiryReminder } from "@/components/common/plan-expiry-reminder";

function Layout({ children }: LayoutProps<"/user">) {
  return (
    <main>
      <Navbar role="user" />
      <PlanExpiryReminder />
      {children}
    </main>
  )
}

export default Layout
