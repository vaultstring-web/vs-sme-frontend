# Frontend RBAC Implementation Guide

This guide explains how to use the Role-Based Access Control (RBAC) system in the frontend application.

## Overview

The frontend RBAC system is built on top of the backend authorization system and provides:
- Automatic permission loading from backend
- Role-based navigation filtering
- Permission-based UI component rendering
- Page-level access control
- Convenient permission checking hooks

## Core Concepts

### Roles

The application has 6 roles:
- **SUPER_ADMIN**: Full system access
- **LOAN_MANAGER**: Manages loan applications and approvals
- **ACCOUNTANT**: Records payments and maintains financial records
- **LOAN_OFFICER**: Manages disbursements and borrower relations
- **AUDITOR**: Views audit logs and compliance reports
- **APPLICANT**: Submits loans and views own data

### Permissions

Permissions are granular actions grouped by resource:
- `applications:*` - Application management
- `loans:*` - Loan management
- `payments:*` - Payment operations
- `documents:*` - Document handling
- `audit:*` - Audit logging
- `users:*` - User management
- `system:*` - System configuration

## Usage Guide

### 1. Checking Permissions in Components

#### Using the `usePermission` Hook

The easiest way to check permissions in functional components:

```typescript
import { usePermission } from '@/hooks/usePermission';

export function ApplicationList() {
  const permission = usePermission();

  return (
    <div>
      {permission.can('applications:view:all') && (
        <div>You can view all applications</div>
      )}
      
      {permission.isSuperAdmin && (
        <button>Delete Application</button>
      )}
    </div>
  );
}
```

#### Using the `useAuth` Hook

For more detailed user information:

```typescript
import { useAuth } from '@/hooks/useAuth';

export function UserProfile() {
  const { user, hasPermission } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Role: {user?.role}</p>
      
      {hasPermission('admin:delete') && (
        <button>Delete Account</button>
      )}
    </div>
  );
}
```

### 2. Conditional Rendering with `Can` Component

Show/hide content based on permissions without hooks:

```typescript
import { Can, Cannot } from '@/components/permissions';

export function ApplicationCard({ app }) {
  return (
    <div className="card">
      <h3>{app.name}</h3>
      
      {/* Show approve button only to loan managers */}
      <Can permission="applications:approve">
        <button>Approve</button>
      </Can>
      
      {/* Show multiple permission options */}
      <Can permission={['applications:recommend:approve', 'applications:approve']}>
        <button>Recommend/Approve</button>
      </Can>
      
      {/* Role-based rendering */}
      <Can role="LOAN_OFFICER">
        <button>Assign Officer</button>
      </Can>
      
      {/* With fallback */}
      <Can 
        permission="applications:edit:documents" 
        fallback={<span className="text-gray-400">No access</span>}
      >
        <button>Upload Documents</button>
      </Can>
    </div>
  );
}
```

### 3. Page-Level Protection

Protect entire pages from unauthorized access:

```typescript
// src/app/admin/loans/page.tsx

import { ProtectedPage } from '@/components/ProtectedPage';
import { LoansContent } from '@/components/LoansContent';

export default function LoansPage() {
  return (
    <ProtectedPage requiredPermissions={['loans:view:all']}>
      <LoansContent />
    </ProtectedPage>
  );
}
```

Or use the HOC pattern:

```typescript
import { withProtectedPage } from '@/components/ProtectedPage';

function AuditLogsPage() {
  return <AuditLogContent />;
}

export default withProtectedPage(AuditLogsPage, {
  requiredPermissions: ['audit:view'],
});
```

### 4. Navigation Filtering

The AdminSidebar automatically filters menu items based on permissions:

```typescript
// Each menu item is defined with optional permission requirements
{
  name: 'Applications',
  href: '/admin/applications',
  icon: FileText,
  requiredPermissions: ['applications:view:all']
}

// Or require a specific role
{
  name: 'Compliance Report',
  href: '/admin/compliance',
  icon: ShieldCheck,
  requiredRole: ['SUPER_ADMIN', 'LOAN_MANAGER']
}
```

## Common Patterns

### Conditional Button Rendering

```typescript
// Show button only if user can perform action
<Can permission="loans:disburse">
  <button onClick={disburse}>Disburse Loan</button>
</Can>

// With disabled state as fallback
<button 
  disabled={!permission.can('loans:disburse')}
>
  Disburse Loan
</button>
```

### Role-Specific Views

```typescript
export function Dashboard() {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'LOAN_MANAGER':
      return <LoanManagerDashboard />;
    case 'ACCOUNTANT':
      return <AccountantDashboard />;
    case 'AUDITOR':
      return <AuditDashboard />;
    default:
      return <ApplicantDashboard />;
  }
}
```

### Multiple Permission Requirements

```typescript
// Require ANY permission (OR logic)
permission.canAny(['applications:approve', 'applications:recommend:approve'])

// Require ALL permissions (AND logic)
permission.canAll(['loans:view:all', 'loans:disburse'])

// Use in component
<Can 
  permission={['admin:users:create', 'admin:users:update']}
  requireAll={true}
>
  <button>Manage Users</button>
</Can>
```

### Forms with Permission Checks

```typescript
export function ApplicationForm({ app }) {
  const permission = usePermission();

  return (
    <form>
      <TextField name="applicantName" />
      
      <Can permission="applications:edit:documents">
        <DocumentUpload />
      </Can>
      
      {permission.isLoanManager && (
        <>
          <TextField name="riskScore" />
          <Select name="recommendation" />
        </>
      )}
      
      <button type="submit">
        {permission.isSuperAdmin ? 'Approve' : 'Save Draft'}
      </button>
    </form>
  );
}
```

## Permission Reference

### Application Permissions
- `applications:view:all` - View all applications
- `applications:view:own` - View own applications
- `applications:approve` - Approve applications
- `applications:reject` - Reject applications
- `applications:recommend:approve` - Recommend approval
- `applications:recommend:reject` - Recommend rejection
- `applications:edit:documents` - Edit application documents
- `applications:request:documents` - Request documents

### Loan Permissions
- `loans:view:all` - View all loans
- `loans:view:own` - View own loans
- `loans:disburse` - Disburse funds
- `loans:authorize:disbursement` - Authorize disbursement
- `loans:restructure` - Restructure loan
- `loans:write_off` - Write off loan

### Payment Permissions
- `payments:view:all` - View all payments
- `payments:view:own` - View own payments
- `payments:record` - Record payments
- `payments:edit` - Edit payments
- `payments:reverse` - Reverse payments

### Document Permissions
- `documents:upload` - Upload documents
- `documents:verify` - Verify documents

### Admin Permissions
- `users:manage` - Manage users
- `users:change:role` - Change user roles
- `audit:view` - View audit logs
- `system:configure` - System configuration

## Best Practices

1. **Always validate on the backend**: Frontend checks are for UX only. Always validate permissions on the backend.

2. **Use specific permissions**: Use granular permissions (e.g., `payments:edit`) rather than generic ones.

3. **Keep permissions in sync**: If you add new permissions in the backend, update `src/lib/permissions.ts` and the type definition in `src/types/api.ts`.

4. **Protect page routes**: Always wrap sensitive pages with `ProtectedPage` or `withProtectedPage`.

5. **Provide feedback**: Show disabled buttons or helpful messages instead of just hiding content.

6. **Use roles for layout, permissions for actions**: Use roles to determine overall page layout, use permissions for specific actions.

## File Structure

```
frontend/src/
├── lib/
│   └── permissions.ts          # Permission definitions and helpers
├── hooks/
│   ├── useAuth.ts              # Auth context hook
│   └── usePermission.ts         # Permission checking hook
├── context/
│   └── AuthContext.tsx          # Auth state with permissions
├── components/
│   ├── layout/
│   │   └── AdminSidebar.tsx    # Permission-aware navigation
│   ├── permissions/
│   │   ├── Can.tsx             # Permission UI components
│   │   ├── types.ts            # Permission type definitions
│   │   └── index.ts            # Exports
│   └── ProtectedPage.tsx        # Page protection component
├── types/
│   └── api.ts                  # Type definitions (Role, Permission)
└── middleware.ts               # Route protection middleware
```

## Testing

When testing components with permissions:

```typescript
import { render } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'LOAN_MANAGER',
  permissions: ['applications:view:all', 'applications:approve']
};

function renderWithAuth(component, user = mockUser) {
  return render(
    <AuthProvider initialUser={user}>
      {component}
    </AuthProvider>
  );
}
```

## Troubleshooting

### Permissions not showing up

1. Ensure user is authenticated: Check that `user` is not null in `useAuth()`
2. Check role: Verify `user.role` matches expected role
3. Check backend response: Inspect network tab to see if role is returned from `/auth/users/me`
4. Clear cache: Permissions are cached in AuthContext, may need to refresh

### Components visible when they shouldn't be

1. Remember to add `requiredPermissions` or `requiredRole` to menu items
2. Use `ProtectedPage` for sensitive pages - `Can` component is only for UX, not security
3. Always validate on backend - frontend rendering is for UX only

### Permission strings don't match

1. Check `src/lib/permissions.ts` for correct spelling
2. Match the ROLE_PERMISSIONS object keys exactly
3. Use IDE autocomplete for type safety
