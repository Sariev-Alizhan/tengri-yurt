import { YurtQuizClient } from './YurtQuizClient'

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <YurtQuizClient locale={locale} />
}
