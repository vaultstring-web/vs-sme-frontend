// src/app/login/page.tsx (or src/pages/login.tsx – adjust to your file location)
import { Suspense } from 'react';          // <-- import Suspense
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import logo from "../../vaultlogo.png";

const LoginPage = () => {
    return (
        <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Image src={logo} alt="Vaultstring Thrive" height={64} className="h-16 w-auto" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    VaultString Thrive
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Suspense fallback={<div>Loading...</div>}> 
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
};

export default LoginPage;