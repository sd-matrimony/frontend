import { Heart, Phone, MapPin, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

async function Footer() {
  const t = await getTranslations("public.footer");

  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-linear-to-r from-rose-400 to-pink-500 p-2 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                SD Matrimony
              </span>
            </div>

            <p className="text-gray-400">
              {t("tagline")}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("contactInfoTitle")}</h3>
            <div className="space-y-3">
              <div className="df gap-4">
                <Phone className="h-5 w-5 text-rose-400" />
                <div className="df flex-wrap text-gray-400">
                  <a href="tel:+919791155234" className="hover:text-white">+91 9791155234</a>
                  <span>|</span>
                  <a href="tel:+918667042132" className="hover:text-white">+91 8667042132</a>
                </div>
              </div>

              <div className="df gap-4">
                <Mail className="h-5 w-5 text-rose-400" />
                <div className="df flex-wrap text-gray-400">
                  <a href="mailto:admin@sdmatrimony.com" className="hover:text-white">admin@sdmatrimony.com</a>
                </div>
              </div>

              <div className="df gap-4">
                <MapPin className="h-5 w-5 text-rose-400" />
                <div>
                  <p className="text-gray-400">{t("addressLine1")}</p>
                  <p className="text-gray-400">{t("addressLine2")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-gray-400 border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="mb-1">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>

          <p className="df justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white">{t("privacyPolicy")}</Link>
            <span>|</span>
            <Link href="/terms-and-conditions" className="hover:text-white">{t("termsAndConditions")}</Link>
            <span>|</span>
            <Link href="/cancellation-and-refund-policy" className="hover:text-white">{t("refundPolicy")}</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
