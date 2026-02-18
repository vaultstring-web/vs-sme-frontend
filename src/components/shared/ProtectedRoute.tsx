'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
<<<<<<< HEAD
        if (!isLoading && !isAuthenticated) {
            // Preserve intended destination
            const returnUrl = encodeURIComponent(pathname ?? '/');
            router.push(`/login?returnUrl=${returnUrl}`);
=======
        if (!isLoading) {
            if (!isAuthenticated) {
                // Preserve intended destination
                const returnUrl = encodeURIComponent(pathname ?? '/');
                router.push(`/login?returnUrl=${returnUrl}`);
            } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                // Redirect to unauthorized page or dashboard if role doesn't match
                router.push('/dashboard'); // Assuming dashboard is the default for authenticated users
            }
>>>>>>> b7245c4e2de9aebc3e52b641c330300c15710cd9
        }
    }, [isAuthenticated, isLoading, router, pathname, user, allowedRoles]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return <>{children}</>;
};

export default ProtectedRoute;
