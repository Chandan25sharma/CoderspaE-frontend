import ProblemDetail from '@/components/challenges/ProblemDetail';

export default async function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProblemDetail problemId={id} />;
}
