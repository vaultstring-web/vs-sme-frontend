import Image from "next/image";
import RegisterForm from "../components/auth/RegisterForm";
import logo from "../vaultlogo.png";

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src={logo}
            alt="Vaultstring Thrive"
            height={64}
            className="h-16 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Join Vaultstring Thrive
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Smart financial solutions for SMEs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
