import { Suspense } from 'react';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ShieldCheck } from 'lucide-react';
import logo from "../../vaultlogo.png";

const LoginPage = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* LEFT — illustration panel, tinted to tie into the brand green */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
                {/* Decorative background blobs */}
                <div className="absolute top-1/4 -left-12 w-72 h-72 bg-green-200/40 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-12 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-md text-center px-12">
                    <div className="w-[380px] h-[380px] mx-auto">
                        <DotLottieReact
                            src="https://lottie.host/42a2c85f-9ada-4232-8968-be1b47d21438/rWY17Tbv8N.lottie"
                            loop
                            autoplay
                        />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-gray-900">
                        Grow your business with confidence
                    </h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                        Fast, secure microfinance loans.
                    </p>
                </div>
            </div>

            {/* RIGHT — login form, curved edge bleeds over the left panel */}
            <div className="hidden lg:flex w-[55%] -ml-16 bg-gray-50 rounded-l-[70px] shadow-[-20px_0_60px_rgba(0,0,0,0.08)] relative z-10 items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md">

                    <div className="flex justify-center">
                        <Image src={logo} alt="Vaultstring Thrive" height={56} className="h-14 w-auto" />
                    </div>

                    <h2 className="mt-5 text-center text-2xl font-bold text-gray-900 tracking-tight">
                        VaultString Thrive
                    </h2>

                    <div className="mt-3 flex justify-center">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                Licensed by <span className="text-gray-900">Reserve Bank of Malawi</span>
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <Suspense fallback={<div className="text-center text-gray-400 py-8">Loading...</div>}>
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* Mobile fallback — full width, no overlap (overlap effect only works at lg+ widths) */}
            <div className="flex lg:hidden flex-1 items-center justify-center px-4 sm:px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="flex justify-center">
                        <Image src={logo} alt="Vaultstring Thrive" height={56} className="h-14 w-auto" />
                    </div>
                    <h2 className="mt-5 text-center text-2xl font-bold text-gray-900 tracking-tight">
                        VaultString Thrive
                    </h2>
                    <div className="mt-3 flex justify-center">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                Licensed by <span className="text-gray-900">Reserve Bank of Malawi</span>
                            </span>
                        </div>
                    </div>
                    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <Suspense fallback={<div className="text-center text-gray-400 py-8">Loading...</div>}>
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;