import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy - SD Matrimony",
  description: "Understand how SD Matrimony collects and protects your personal information.",
  keywords: ["Privacy Policy", "Matrimony"],
  openGraph: {
    title: "Privacy Policy - SD Matrimony",
    description: "Learn about our privacy practices for users of our matrimony platform.",
    url: "/privacy-policy",
    type: "website",
  },
}

async function Page() {
  const t = await getTranslations("public.privacyPolicy");
  const bold = (chunks: React.ReactNode) => <strong className="font-semibold">{chunks}</strong>

  return (
    <main className="prose-sm md:prose prose-slate prose-li:my-0 prose-p:my-1 prose-a:no-underline prose-a:hover:text-pink-600 max-w-11/12! mx-auto my-16 p-6 bg-pink-50/30 shadow-sm rounded-lg border">
      <header className="mb-6">
        <h1 className="mb-1! md:font-semibold">{t("title")}</h1>
        <p className="mt-0!">{t("lastUpdated")}</p>
      </header>

      <section>
        <p>{t.rich("intro1", { b: bold })}</p>
        <p>{t("intro2")}</p>
        <p>{t("intro3")}</p>

        <h3>{t("collectTitle")}</h3>
        <ul>
          <li>{t("collectItem1")}</li>
          <li>{t("collectItem2")}</li>
          <li>{t("collectItem3")}</li>
        </ul>

        <h3>{t("useTitle")}</h3>
        <ul>
          <li>{t("useItem1")}</li>
          <li>{t("useItem2")}</li>
          <li>{t("useItem3")}</li>
          <li>{t("useItem4")}</li>
          <li>{t("useItem5")}</li>
        </ul>

        <h3>{t("cookiesTitle")}</h3>
        <p>{t("cookiesBody")}</p>

        <h3>{t("controlTitle")}</h3>
        <p>{t("controlIntro")}</p>
        <ul>
          <li>{t("controlItem1")}</li>
          <li>{t.rich("controlItem2", { email: (chunks) => <a href="mailto:admin@sdmatrimony.com">{chunks}</a> })}</li>
        </ul>

        <p className="mb-4!">{t("noSell")}</p>

        <p>{t.rich("updateInfo", {
          email: (chunks) => <a href="mailto:admin@sdmatrimony.com">{chunks}</a>,
          phone1: (chunks) => <a href="tel:+919791155234">{chunks}</a>,
          phone2: (chunks) => <a href="tel:+918667042132">{chunks}</a>,
        })}</p>
      </section>
    </main>
  )
}

export default Page
