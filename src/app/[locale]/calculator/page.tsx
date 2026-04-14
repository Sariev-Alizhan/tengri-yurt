import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { FooterSection } from '@/components/FooterSection'
import { CalculatorClient } from './CalculatorClient'

export const metadata: Metadata = {
  title: 'Yurt Price Calculator — Tengri Yurt',
  description: 'Estimate the cost of your custom Kazakh yurt. Choose size, accessories and delivery to get an instant price range.',
}

export default async function CalculatorPage() {
  const locale = await getLocale()
  const tFooter = await getTranslations('footer')
  return (
    <>
      <Navbar />
      <CalculatorClient locale={locale} />
      <FooterSection
        locale={locale}
        tagline={tFooter('tagline')}
        contactLabel={tFooter('contact')}
        followLabel={tFooter('follow')}
        address={tFooter('address')}
        copyright={tFooter('copyright')}
      />
    </>
  )
}
