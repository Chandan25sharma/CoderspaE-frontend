import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to admin dashboard or main page
  redirect('/admin/dashboard');
}