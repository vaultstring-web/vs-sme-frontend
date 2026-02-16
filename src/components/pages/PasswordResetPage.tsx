import Image from "next/image";
import PasswordResetRequest from "@/components/auth/PasswordResetRequest";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import logo from "../../vaultlogo.png";

interface PasswordResetPageProps {
  token?: string;
}

const PasswordResetPage = ({ token }: PasswordResetPageProps) => {
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
          Account Security
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {token ? <PasswordResetForm token={token} /> : <PasswordResetRequest />}
      </div>
    </div>
  );
};

export default PasswordResetPage;
