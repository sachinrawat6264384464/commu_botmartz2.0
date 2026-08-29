export type UserRole = 'super-admin' | 'event-manager' | 'volunteer';

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  allowedPaths: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, {
  label: string;
  allowedPaths: string[];
  canManageFinance: boolean;
  canManageCoupons: boolean;
  canManageEvents: boolean;
  canScanTickets: boolean;
  canIssueCertificates: boolean;
}> = {
  'super-admin': {
    label: 'Super Administrator',
    allowedPaths: [
      '/admin',
      '/admin/events',
      '/admin/bootcamps',
      '/admin/payments',
      '/admin/coupons',
      '/admin/scanner',
      '/admin/certificates',
      '/admin/feedback',
      '/admin/settings',
      '/event-desk'
    ],
    canManageFinance: true,
    canManageCoupons: true,
    canManageEvents: true,
    canScanTickets: true,
    canIssueCertificates: true
  },
  'event-manager': {
    label: 'Event / Community Lead',
    allowedPaths: [
      '/admin',
      '/admin/events',
      '/admin/bootcamps',
      '/admin/scanner',
      '/admin/certificates',
      '/admin/feedback',
      '/event-desk'
    ],
    canManageFinance: false,
    canManageCoupons: false,
    canManageEvents: true,
    canScanTickets: true,
    canIssueCertificates: true
  },
  'volunteer': {
    label: 'Volunteer / Scanner Staff',
    allowedPaths: [
      '/admin/scanner',
      '/event-desk'
    ],
    canManageFinance: false,
    canManageCoupons: false,
    canManageEvents: false,
    canScanTickets: true,
    canIssueCertificates: false
  }
};

export function isPathAllowed(role: UserRole, path: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  return permissions.allowedPaths.some(allowed => 
    path === allowed || (allowed !== '/admin' && path.startsWith(allowed + '/'))
  );
}
