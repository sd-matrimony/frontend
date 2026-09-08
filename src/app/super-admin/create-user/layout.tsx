import { getTranslations } from "next-intl/server";

async function Layout({ children }: LayoutProps<"/super-admin/create-user">) {
  const t = await getTranslations("superAdmin.createUser")

  return (
    <div className="p-8 pb-6 max-w-2xl mt-8 mx-auto border rounded-2xl shadow">
      <h1 className="mb-2 text-xl font-bold">{t("title")}</h1>
      {children}
    </div>
  )
}

export default Layout
