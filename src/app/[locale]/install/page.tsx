import QRCode from 'qrcode'
import { InstallView } from './InstallView'

export const dynamic = 'force-static'

const BASE_URL = 'https://www.tengri-yurt.kz'

async function generateQR(url: string) {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 640,
    color: {
      dark: '#1A1510',
      light: '#F5EFE4',
    },
  })
}

export default async function InstallPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const androidUrl = `${BASE_URL}/${locale}?src=qr-android`
  const iosUrl = `${BASE_URL}/${locale}?src=qr-ios`

  const [androidQR, iosQR] = await Promise.all([
    generateQR(androidUrl),
    generateQR(iosUrl),
  ])

  return (
    <InstallView
      locale={locale}
      androidQR={androidQR}
      iosQR={iosQR}
      siteUrl={BASE_URL.replace(/^https?:\/\//, '')}
    />
  )
}
