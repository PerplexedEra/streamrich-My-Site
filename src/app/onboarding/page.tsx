import { redirect } from 'next/navigation';

export default function OnboardingPage() {
  // Redirect to the role selection page by default
  redirect('/onboarding/role-selection');
}
