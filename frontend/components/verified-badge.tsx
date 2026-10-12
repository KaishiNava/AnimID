import { BadgeCheck } from 'lucide-react';

/** Visual community badge for AnimID staff/verified profiles. This is not a Meta-issued verification badge. */
export function VerifiedBadge({ label = 'Akun terverifikasi AnimID' }: { label?: string }) {
  return <span className="animid-verified" title={label} aria-label={label}><BadgeCheck size={15} fill="currentColor" strokeWidth={2.5} /></span>;
}
