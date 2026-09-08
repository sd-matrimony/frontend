import { CardContent, Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/common/language-switcher";

function Layout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="dc p-8 min-h-screen bg-linear-to-r from-pink-100 to-purple-100 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher triggerCls="h-8 px-2" />
      </div>

      <Card className="w-full max-w-md has-[#signup-form]:max-w-2xl">
        <CardContent className="p-8">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export default Layout
