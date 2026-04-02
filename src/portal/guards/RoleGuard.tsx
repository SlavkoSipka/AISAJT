import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import type { Role } from '../lib/types';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: Role;
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="portal-root flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 text-[#00bcd4] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/portal/login" replace />;
  }

  if (profile.role !== requiredRole) {
    const redirect = profile.role === 'admin' ? '/portal/admin' : '/portal/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
