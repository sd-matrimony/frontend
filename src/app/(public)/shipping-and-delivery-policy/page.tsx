import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy - SD Matrimony",
  description: "Our platform provides digital matrimony services; no physical shipping is involved.",
  keywords: ["Shipping Policy", "Delivery Policy", "Matrimony"],
  openGraph: {
    title: "Shipping & Delivery Policy",
    description: "Learn about our digital services and no-physical-shipping policy.",
    url: "/shipping-and-delivery-policy",
    type: "website",
  },
}

async function Page() {
  const t = await getTranslations("public.shippingDelivery");
  const bold = (chunks: React.ReactNode) => <strong className="font-semibold">{chunks}</strong>

  return (
    <main className="prose-sm md:prose prose-slate prose-li:my-0 prose-p:my-1 prose-h3:mb-0 max-w-11/12! prose-a:no-underline prose-a:hover:text-pink-600 mx-auto my-16 p-6 bg-pink-50/30 shadow-sm rounded-lg border">
      <header className="mb-6">
        <h1 className="mb-1! md:font-semibold">{t("title")}</h1>
        <p className="mt-0!">{t("lastUpdated")}</p>
      </header>

      <section>
        <h3>{t("digitalTitle")}</h3>
        <p>{t.rich("digitalBody", { b: bold })}</p>

        <h3>{t("accessTitle")}</h3>
        <p>{t("accessBody")}</p>

        <h3>{t("confirmationTitle")}</h3>
        <p>{t("confirmationBody")}</p>

        <h3>{t("noShippingTitle")}</h3>
        <p>{t("noShippingBody")}</p>
      </section>
    </main>
  )
}

export default Page
