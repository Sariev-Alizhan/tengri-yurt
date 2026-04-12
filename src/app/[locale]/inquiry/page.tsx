import { getTranslations } from 'next-intl/server'
import { InquiryWizard } from './InquiryWizard'

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ yurt?: string }>
}) {
  const t = await getTranslations('inquiry')
  const { yurt } = await searchParams

  const translations = {
    // Steps
    step1Title: t('step1Title'),
    step1Subtitle: t('step1Subtitle'),
    step2Title: t('step2Title'),
    step2Subtitle: t('step2Subtitle'),
    step3Title: t('step3Title'),
    step3Subtitle: t('step3Subtitle'),
    step4Title: t('step4Title'),
    step4Subtitle: t('step4Subtitle'),
    // Purpose options
    purposeRetreat: t('purposeRetreat'),
    purposeResort: t('purposeResort'),
    purposeEvent: t('purposeEvent'),
    purposePrivate: t('purposePrivate'),
    purposeOther: t('purposeOther'),
    // Size options
    sizeIntimate: t('sizeIntimate'),
    sizeCozy: t('sizeCozy'),
    sizeClassic: t('sizeClassic'),
    sizeGrand: t('sizeGrand'),
    sizeNotSure: t('sizeNotSure'),
    // Form
    namePlaceholder: t('namePlaceholder'),
    emailPlaceholder: t('emailPlaceholder'),
    phonePlaceholder: t('phonePlaceholder'),
    messagePlaceholder: t('messagePlaceholder'),
    countryPlaceholder: t('countryPlaceholder'),
    // Buttons
    next: t('next'),
    back: t('back'),
    submit: t('submit'),
    // Success
    successTitle: t('successTitle'),
    successSubtitle: t('successSubtitle'),
    successBack: t('successBack'),
  }

  return <InquiryWizard translations={translations} preselectedYurt={yurt} />
}
