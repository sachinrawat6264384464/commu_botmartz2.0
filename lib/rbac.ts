export type UserRole = 'super-admin' | 'manager' | 'volunteer';

export interface RolePermissions {
  label: string;
  canManageEvents: boolean;
  canManageBootcamps: boolean;
  canManageFinance: boolean;
  canManageCoupons: boolean;
  canScanTickets: boolean;
  canIssueCertificates: boolean;
  canSendNewsletters: boolean;
  canViewAnalytics: boolean;
  canModerateDiscussions: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'super-admin': {
    label: 'Super Administrator',
    canManageEvents: true,
    canManageBootcamps: true,
    canManageFinance: true,
    canManageCoupons: true,
    canScanTickets: true,
    canIssueCertificates: true,
    canSendNewsletters: true,
    canViewAnalytics: true,
    canModerateDiscussions: true,
  },
  'manager': {
    label: 'Community & Event Manager',
    canManageEvents: true,
    canManageBootcamps: true,
    canManageFinance: false, // Super Admin only
    canManageCoupons: true,
    canScanTickets: true,
    canIssueCertificates: true,
    canSendNewsletters: true,
    canViewAnalytics: true,
    canModerateDiscussions: true,
  },
  'volunteer': {
    label: 'Event Volunteer / Scanner',
    canManageEvents: false,
    canManageBootcamps: false,
    canManageFinance: false,
    canManageCoupons: false,
    canScanTickets: true,
    canIssueCertificates: false,
    canSendNewsletters: false,
    canViewAnalytics: false,
    canModerateDiscussions: false,
  },
};

export function isPathAllowed(role: UserRole, pathname: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['volunteer'];

  if (pathname === '/admin' || pathname === '/admin/login') return true;
  if (pathname.startsWith('/admin/events')) return perms.canManageEvents;
  if (pathname.startsWith('/admin/arena')) return perms.canManageEvents;
  if (pathname.startsWith('/admin/challenges')) return perms.canManageEvents;
  if (pathname.startsWith('/admin/bootcamps')) return perms.canManageBootcamps;
  if (pathname.startsWith('/admin/payments')) return perms.canManageFinance;
  if (pathname.startsWith('/admin/coupons')) return perms.canManageCoupons;
  if (pathname.startsWith('/admin/scanner')) return perms.canScanTickets;
  if (pathname.startsWith('/admin/certificates')) return perms.canIssueCertificates;
  if (pathname.startsWith('/admin/analytics')) return perms.canViewAnalytics;
  if (pathname.startsWith('/admin/newsletter')) return perms.canSendNewsletters;
  if (pathname.startsWith('/admin/team')) return perms.canManageFinance; // Super Admin only
  if (pathname.startsWith('/admin/security')) return perms.canManageFinance; // Super Admin only
  if (pathname.startsWith('/admin/feedback')) return perms.canManageEvents;
  if (pathname.startsWith('/admin/discussions')) return perms.canModerateDiscussions;

  return false;
}
