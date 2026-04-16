'use client'

import Image from 'next/image'

type Copy = {
  title: string
  subtitle: string
  scanHint: string
  androidTitle: string
  iosTitle: string
  androidSteps: string[]
  iosSteps: string[]
  visitLabel: string
  installLabel: string
  urlLabel: string
}

const COPY: Record<string, Copy> = {
  en: {
    title: 'Install Tengri Yurt',
    subtitle: 'Scan with your phone camera — open the site or add it to your home screen like an app.',
    scanHint: 'Point your camera at the QR code for your device',
    androidTitle: 'Android',
    iosTitle: 'iPhone / iPad',
    androidSteps: [
      'Open the camera and scan the Android QR code',
      'Tap the link to open the site in Chrome',
      'A banner will appear — tap "Install app"',
      'Or open the Chrome menu (⋮) and tap "Install app" / "Add to Home screen"',
    ],
    iosSteps: [
      'Open the camera and scan the iPhone QR code',
      'Tap the link to open the site in Safari',
      'Tap the Share button (square with an arrow up)',
      'Scroll and tap "Add to Home Screen" → "Add"',
    ],
    visitLabel: 'Visit site',
    installLabel: 'Install as app',
    urlLabel: 'Or go directly to',
  },
  ru: {
    title: 'Установите Tengri Yurt',
    subtitle: 'Отсканируйте камерой телефона — откройте сайт или добавьте его на экран устройства как приложение.',
    scanHint: 'Наведите камеру на QR-код вашего устройства',
    androidTitle: 'Android',
    iosTitle: 'iPhone / iPad',
    androidSteps: [
      'Откройте камеру и отсканируйте QR-код для Android',
      'Нажмите на ссылку, чтобы открыть сайт в Chrome',
      'Появится баннер — нажмите «Установить приложение»',
      'Или откройте меню Chrome (⋮) и выберите «Установить приложение» / «Добавить на главный экран»',
    ],
    iosSteps: [
      'Откройте камеру и отсканируйте QR-код для iPhone',
      'Нажмите на ссылку, чтобы открыть сайт в Safari',
      'Нажмите кнопку «Поделиться» (квадрат со стрелкой вверх)',
      'Прокрутите и выберите «На экран «Домой»» → «Добавить»',
    ],
    visitLabel: 'Перейти на сайт',
    installLabel: 'Установить как приложение',
    urlLabel: 'Или перейдите напрямую',
  },
  kk: {
    title: 'Tengri Yurt қолданбасын орнатыңыз',
    subtitle: 'Телефон камерасымен сканерлеңіз — сайтты ашыңыз немесе оны қолданба сияқты басты экранға қосыңыз.',
    scanHint: 'Камераны өз құрылғыңыздың QR-кодына бағыттаңыз',
    androidTitle: 'Android',
    iosTitle: 'iPhone / iPad',
    androidSteps: [
      'Камераны ашып, Android QR-кодын сканерлеңіз',
      'Сайтты Chrome-да ашу үшін сілтемені басыңыз',
      'Баннер пайда болады — «Қолданбаны орнату» батырмасын басыңыз',
      'Немесе Chrome мәзірін ашып (⋮), «Қолданбаны орнату» / «Басты экранға қосу» таңдаңыз',
    ],
    iosSteps: [
      'Камераны ашып, iPhone QR-кодын сканерлеңіз',
      'Сайтты Safari-де ашу үшін сілтемені басыңыз',
      '«Бөлісу» батырмасын басыңыз (жоғары бағытталған көрсеткі бар шаршы)',
      'Төмен қарай жылжып, «Басты экранға қосу» → «Қосу» таңдаңыз',
    ],
    visitLabel: 'Сайтқа кіру',
    installLabel: 'Қолданба ретінде орнату',
    urlLabel: 'Немесе тікелей өтіңіз',
  },
  zh: {
    title: '安装 Tengri Yurt',
    subtitle: '使用手机相机扫描 — 打开网站或将其作为应用添加到设备主屏幕。',
    scanHint: '将相机对准适合您设备的二维码',
    androidTitle: 'Android',
    iosTitle: 'iPhone / iPad',
    androidSteps: [
      '打开相机并扫描 Android 二维码',
      '点击链接在 Chrome 中打开网站',
      '将出现横幅 — 点击"安装应用"',
      '或打开 Chrome 菜单 (⋮) 点击"安装应用" / "添加到主屏幕"',
    ],
    iosSteps: [
      '打开相机并扫描 iPhone 二维码',
      '点击链接在 Safari 中打开网站',
      '点击"分享"按钮（带向上箭头的方块）',
      '滚动并点击"添加到主屏幕" → "添加"',
    ],
    visitLabel: '访问网站',
    installLabel: '作为应用安装',
    urlLabel: '或直接访问',
  },
  ar: {
    title: 'تثبيت تطبيق Tengri Yurt',
    subtitle: 'امسح بكاميرا هاتفك — افتح الموقع أو أضفه إلى الشاشة الرئيسية كتطبيق.',
    scanHint: 'وجّه الكاميرا نحو رمز QR المناسب لجهازك',
    androidTitle: 'Android',
    iosTitle: 'iPhone / iPad',
    androidSteps: [
      'افتح الكاميرا وامسح رمز QR الخاص بـ Android',
      'اضغط على الرابط لفتح الموقع في Chrome',
      'ستظهر لافتة — اضغط على "تثبيت التطبيق"',
      'أو افتح قائمة Chrome (⋮) واضغط على "تثبيت التطبيق" / "إضافة إلى الشاشة الرئيسية"',
    ],
    iosSteps: [
      'افتح الكاميرا وامسح رمز QR الخاص بـ iPhone',
      'اضغط على الرابط لفتح الموقع في Safari',
      'اضغط على زر "مشاركة" (مربع بسهم للأعلى)',
      'مرّر واضغط على "إضافة إلى الشاشة الرئيسية" ← "إضافة"',
    ],
    visitLabel: 'زيارة الموقع',
    installLabel: 'تثبيت كتطبيق',
    urlLabel: 'أو اذهب مباشرة إلى',
  },
}

function AndroidIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17V9a7 7 0 0 1 14 0v8" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <line x1="8" y1="3.5" x2="6.5" y2="6" />
      <line x1="16" y1="3.5" x2="17.5" y2="6" />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" />
      <circle cx="15" cy="12" r="0.8" fill="currentColor" />
      <line x1="6" y1="17" x2="6" y2="21" />
      <line x1="18" y1="17" x2="18" y2="21" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}

export function InstallView({
  locale,
  androidQR,
  iosQR,
  siteUrl,
}: {
  locale: string
  androidQR: string
  iosQR: string
  siteUrl: string
}) {
  const t = COPY[locale] || COPY.en
  const isRTL = locale === 'ar'

  return (
    <main
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        background: '#1A1510',
        color: '#F5EFE4',
        minHeight: '100vh',
        padding: 'clamp(40px, 8vw, 96px) clamp(16px, 5vw, 48px)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <Image
            src="/images/logo_white.png"
            alt="Tengri Yurt"
            width={120}
            height={40}
            style={{ height: '36px', width: 'auto', margin: '0 auto 24px', opacity: 0.85 }}
          />
          <h1
            className="font-garamond"
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              marginBottom: '14px',
              color: '#F5EFE4',
            }}
          >
            {t.title}
          </h1>
          <p
            className="font-inter"
            style={{
              fontSize: 'clamp(14px, 1.6vw, 16px)',
              color: 'rgba(245,239,228,0.6)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(20px, 3vw, 40px)',
          }}
        >
          <InstallCard
            icon={<AndroidIcon />}
            title={t.androidTitle}
            qr={androidQR}
            steps={t.androidSteps}
            accent="#A4C639"
          />
          <InstallCard
            icon={<AppleIcon />}
            title={t.iosTitle}
            qr={iosQR}
            steps={t.iosSteps}
            accent="#C9A86E"
          />
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: 'clamp(32px, 6vw, 56px)',
            paddingTop: 'clamp(24px, 4vw, 32px)',
            borderTop: '1px solid rgba(201,168,110,0.15)',
          }}
        >
          <p
            className="font-inter"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(245,239,228,0.4)',
              marginBottom: '8px',
            }}
          >
            {t.urlLabel}
          </p>
          <a
            href={`https://${siteUrl}`}
            className="font-garamond"
            style={{
              fontSize: 'clamp(18px, 2vw, 22px)',
              color: '#C9A86E',
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            {siteUrl}
          </a>
        </div>
      </div>
    </main>
  )
}

function InstallCard({
  icon,
  title,
  qr,
  steps,
  accent,
}: {
  icon: React.ReactNode
  title: string
  qr: string
  steps: string[]
  accent: string
}) {
  return (
    <div
      style={{
        background: 'rgba(245,239,228,0.03)',
        border: '1px solid rgba(201,168,110,0.18)',
        padding: 'clamp(24px, 3vw, 36px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: accent }}>
        {icon}
        <h2
          className="font-garamond"
          style={{
            fontSize: 'clamp(22px, 2.4vw, 28px)',
            fontWeight: 400,
            color: '#F5EFE4',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      <div
        style={{
          background: '#F5EFE4',
          padding: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          aspectRatio: '1 / 1',
          maxWidth: '320px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr}
          alt={`${title} QR code`}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      <ol
        className="font-inter"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          counterReset: 'step',
        }}
      >
        {steps.map((step, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '13.5px',
              lineHeight: 1.55,
              color: 'rgba(245,239,228,0.75)',
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: '22px',
                height: '22px',
                border: `1px solid ${accent}`,
                color: accent,
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 500,
                marginTop: '1px',
              }}
            >
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
