"use client";

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { QueryClientProvider } from '@tanstack/react-query';

import { UIProvider, type uiTextT } from '@glraj/ui/ui-provider';

import { queryClient } from "@/lib/query-client";

function ClientWrapper({ children }: { children: React.ReactNode; }) {
  const t = useTranslations('common')

  const uiText = useMemo<Partial<uiTextT>>(() => ({
    enterPlaceholder: label => t('enterPlaceholder', { label }),
    selectPlaceholder: label => t('selectPlaceholder', { label }),
    loading: t('loading'),
    cancel: t('cancel'),
    confirm: t('confirm'),
    close: t('close'),
    next: t('next'),
  }), [t])

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider text={uiText}>
        {children}
      </UIProvider>
    </QueryClientProvider>
  )
}

export default ClientWrapper
