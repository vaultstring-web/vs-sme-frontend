"use client";
import Image from "next/image";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import LogoutButton from "../components/auth/LogoutButton";
import { useAuth } from "../hooks/useAuth";
import logo from "../vaultlogo.png";

const DashboardContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <Image
                  src={logo}
                  alt="Vaultstring Thrive"
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome,{" "}
                <span className="font-semibold">
                  {user?.name || user?.email}
                </span>
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Dashboard Stats Placeholder */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center text-primary-600">
                      $
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Total Balance
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        $24,500.00
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                      Fn
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Active Loans
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        3
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Recent Activity
              </h3>
              <div className="mt-4 border-t border-gray-200">
                <p className="py-4 text-sm text-gray-500">
                  No recent transactions to display.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default DashboardPage;
