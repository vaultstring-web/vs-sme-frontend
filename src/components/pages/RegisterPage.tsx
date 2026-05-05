import Image from "next/image";
import RegisterForm from "@/components/auth/RegisterForm";
import logo from "../../vaultlogo.png";

const RegisterPage = () => {
  return (
    <div className="mx-auto flex min-h-screen flex-col justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <Image
            src={logo}
            alt="Vaultstring Thrive"
            height={64}
            className="h-16 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Join VaultString Thrive
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Smart financial solutions for individuals, employees and businesses of all kinds.
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-xl">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
