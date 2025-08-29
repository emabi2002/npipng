// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Send "/" to the dashboard route
  redirect('/dash');
}
