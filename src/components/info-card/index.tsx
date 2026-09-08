import { getTranslations } from 'next-intl/server';

import { CardDescription, CardTitle } from '@/components/ui/card';
import Refresh from './refresh';

type props = {
  title: string
}

async function InfoCard({ title }: props) {
  const t = await getTranslations("public.infoCard");

  return (
    <div className="dc flex-col text-center">
      <CardTitle className='text-xl'>{title}</CardTitle>
      <CardDescription>
        <Refresh /> {t("orUseAnother")} <a href="/auth/user/signin" className='text-pink-700 hover:underline'>{t("signIn")}</a>
      </CardDescription>

      <div className='mt-6 text-sm text-muted-foreground'>
        {t("unintentional")} <br />
        <a href="tel:+919791155234" className='text-pink-700 hover:underline'>9791155234</a>
      </div>
    </div>
  )
}

export default InfoCard