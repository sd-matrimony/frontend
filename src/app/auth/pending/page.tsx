import { getTranslations } from 'next-intl/server';

import InfoCard from '@/components/info-card';

async function Page() {
  const t = await getTranslations('auth.status')

  return <InfoCard title={t('pending')} />
}

export default Page