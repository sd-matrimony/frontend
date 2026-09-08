import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact Us - SD Matrimony",
  description: "Get in touch with SD Matrimony for any queries or support.",
  keywords: ["Contact Us", "Support"],
  openGraph: {
    title: "Contact Us",
    description: "Reach out to us for questions or support regarding our matrimony services.",
    url: "/contact-us",
    type: "website",
  },
}

async function Page() {
  const t = await getTranslations("public.contactUs");

  return (
    <main className="prose-sm md:prose prose-slate prose-li:my-0 prose-p:my-1 max-w-11/12! prose-a:no-underline prose-a:hover:text-pink-600 mx-auto my-16 p-6 bg-pink-50/30 shadow-sm rounded-lg border">
      <header className="mb-6">
        <h1 className="mb-1! md:font-semibold">{t("title")}</h1>
        <p className="mt-0!">{t("lastUpdated")}</p>
      </header>

      <section>
        <p>{t("intro")}</p>

        <h3>{t("merchantDetails")}</h3>
        <p><strong className="font-semibold">{t("legalEntityNameLabel")}</strong> {t("legalEntityNameValue")}</p>
        <p><strong className="font-semibold">{t("alsoKnownAsLabel")}</strong> {t("alsoKnownAsValue")}</p>
        <p><strong className="font-semibold">{t("registeredAddressLabel")}</strong> {t("addressValue")}</p>
        <p><strong className="font-semibold">{t("operationalAddressLabel")}</strong> {t("addressValue")}</p>

        <h3>{t("contactInformation")}</h3>
        <p><strong className="font-semibold">{t("telephoneLabel")}</strong> <a href="tel:+919791155234">9791155234</a> or <a href="tel:+918667042132">8667042132</a></p>
        <p><strong className="font-semibold">{t("emailLabel")}</strong> <a href="mailto:admin@sdmatrimony.com">admin@sdmatrimony.com</a></p>
      </section>
    </main>
  )
}

export default Page
