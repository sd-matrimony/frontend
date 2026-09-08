import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Terms & Conditions - SD Matrimony",
  description: "Read the Terms & Conditions for using SD Matrimony services.",
  keywords: ["Terms and Conditions", "Matrimony"],
  openGraph: {
    title: "Terms & Conditions - SD Matrimony",
    description: "Read the Terms & Conditions for using our matrimony platform.",
    url: "/terms-and-conditions",
    type: "website",
  },
}

async function Page() {
  const t = await getTranslations("public.termsAndConditions");
  const bold = (chunks: React.ReactNode) => <strong className="font-semibold">{chunks}</strong>

  return (
    <main className="prose-sm md:prose prose-slate prose-li:my-0 prose-p:my-1 max-w-11/12! prose-a:no-underline prose-a:hover:text-pink-600 mx-auto my-16 p-6 bg-pink-50/30 shadow-sm rounded-lg border">
      <header className="mb-6">
        <h1 className="mb-1! md:font-semibold">{t("title")}</h1>
        <p className="mt-0!">{t("lastUpdated")}</p>
      </header>

      <section>
        <p>{t.rich("intro", { b: bold })}</p>

        <h3>{t("generalTitle")}</h3>
        <ul>
          <li>{t("generalItem1")}</li>
          <li>{t("generalItem2")}</li>
          <li>{t("generalItem3")}</li>
          <li>{t("generalItem4")}</li>
        </ul>

        <h3>{t("ipTitle")}</h3>
        <ul>
          <li>{t("ipItem1")}</li>
          <li>{t("ipItem2")}</li>
          <li>{t("ipItem3")}</li>
        </ul>

        <h3>{t("externalLinksTitle")}</h3>
        <p>{t("externalLinksBody")}</p>

        <h3>{t("governingLawTitle")}</h3>
        <p>{t("governingLawBody")}</p>

        <h3>{t("paymentLiabilityTitle")}</h3>
        <p>{t("paymentLiabilityBody")}</p>
      </section>
    </main>
  )
}

export default Page
