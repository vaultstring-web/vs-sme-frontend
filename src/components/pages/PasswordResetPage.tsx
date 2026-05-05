import Image from "next/image";
import PasswordResetRequest from "@/components/auth/PasswordResetRequest";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import logo from "../../vaultlogo.png";

interface PasswordResetPageProps {
  token?: string;
}

const PasswordResetPage = ({ token }: PasswordResetPageProps) => {
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
          Account Security
        </h2>
      </div>

      <div className="mx-auto mt-8 w-full max-w-md">
        {token ? <PasswordResetForm token={token} /> : <PasswordResetRequest />}
      </div>
    </div>
  );
};

export default PasswordResetPage;
