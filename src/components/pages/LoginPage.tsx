// src/app/login/page.tsx (or src/pages/login.tsx – adjust to your file location)
import { Suspense } from 'react';          // <-- import Suspense
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import { ShieldCheck } from 'lucide-react';
import logo from "../../vaultlogo.png";

const LoginPage = () => {
    return (
        <div className="mx-auto flex min-h-screen flex-col justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md">
                <div className="flex justify-center">
                    <Image src={logo} alt="Vaultstring Thrive" height={64} className="h-16 w-auto" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    VaultString Thrive
                </h2>
                
                {/* RBM License Badge */}
                <div className="mt-4 flex justify-center">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Licensed by <span className="text-gray-900">Reserve Bank of Malawi</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-8 w-full max-w-md">
                <Suspense fallback={<div>Loading...</div>}> 
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
};

export default LoginPage;