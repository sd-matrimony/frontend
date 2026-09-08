import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy - SD Matrimony",
  description: "Know the cancellation and refund policy for memberships and services at SD Matrimony.",
  keywords: ["Cancellation Policy", "Refund Policy", "Matrimony"],
  openGraph: {
    title: "Cancellation & Refund Policy",
    description: "Check our cancellation and refund rules for our matrimony services.",
    url: "/cancellation-and-refund-policy",
    type: "website",
  },
}

async function Page() {
  const t = await getTranslations("public.cancellationRefund");
  const bold = (chunks: React.ReactNode) => <strong className="font-semibold">{chunks}</strong>

  return (
    <main className="prose-sm md:prose prose-slate prose-li:my-0 max-w-11/12! mx-auto my-16 p-6 bg-pink-50/30 shadow-sm rounded-lg border">
      <header className="mb-6">
        <h1 className="mb-1! md:font-semibold">{t("title")}</h1>
        <p className="mt-0!">{t("lastUpdated")}</p>
      </header>

      <section>
        <p>{t.rich("intro", { b: bold })}</p>

        <h3>{t("windowTitle")}</h3>
        <ul>
          <li>{t.rich("windowItem1", { b: bold })}</li>
          <li>{t("windowItem2")}</li>
        </ul>

        <h3>{t("howTitle")}</h3>
        <ul>
          <li>{t.rich("howItem1", { b: bold })}</li>
          <li>{t("howItem2")}</li>
        </ul>

        <h3>{t("refundsTitle")}</h3>
        <ul>
          <li>{t("refundsItem1")}</li>
          <li>{t.rich("refundsItem2", { b: bold })}</li>
        </ul>

        <h3>{t("nonRefundTitle")}</h3>
        <ul>
          <li>{t.rich("nonRefundItem1", { b: bold })}</li>
          <li>{t("nonRefundItem2")}</li>
        </ul>
      </section>
    </main>
  )
}

export default Page
