// src/app/page.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Shield, Clock, Wallet, FileText, Building, Users,
  Menu, X, Bell, Search, User, ChevronDown
} from 'lucide-react';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        {/* Header with Toggle Button */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side with toggle button */}
              <div className="flex items-center">
                {/* Toggle Button for ALL screen sizes */}
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={toggleSidebar}
                >
                  <span className="sr-only">Toggle sidebar</span>
                  {sidebarOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
                
                {/* Logo/Branding - Only shown when sidebar is closed on desktop */}
                <div className={`ml-4 transition-opacity duration-300 ${sidebarOpen ? 'lg:opacity-0 lg:pointer-events-none' : 'lg:opacity-100'}`}>
                  <h1 className="text-xl font-semibold text-gray-900">
                    VaultString SME Portal
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    Secure Loan Management Platform
                  </p>
                </div>
              </div>

              {/* Right side - Header actions */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="search"
                      placeholder="Search..."
                      className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                </button>

                {/* Profile */}
                <div className="relative">
                  <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">Guest User</p>
                      <p className="text-xs text-gray-500">Visitor</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area - Rest of your content remains the same */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Hero Section */}
            <div className="py-12 md:py-20">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Salary on Demand
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Access instant credit for salaried professionals. No paperwork, 24h disbursement directly to your mobile wallet.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="px-10 py-4 text-lg font-semibold"
                    onClick={() => window.location.href = '/apply'}
                  >
                    Apply Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-10 py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => window.location.href = '/learn-more'}
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-6">
                    <Wallet className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">MWK 1.5M Max</h3>
                  <p className="text-gray-600">Maximum loan limit for qualified applicants</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-6">
                    <Clock className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">24-Hour Disbursement</h3>
                  <p className="text-gray-600">Fast approval and fund transfer</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 text-purple-600 mb-6">
                    <FileText className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No Paperwork</h3>
                  <p className="text-gray-600">Digital application process</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-6">
                    <Shield className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Compliant</h3>
                  <p className="text-gray-600">Bank-level security standards</p>
                </div>
              </div>

              {/* For Individuals vs Businesses */}
              <div className="grid md:grid-cols-2 gap-8 mb-20">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 rounded-3xl">
                  <div className="flex items-center mb-6">
                    <Users className="h-10 w-10 mr-4" />
                    <h2 className="text-2xl font-bold">For Individuals</h2>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Salary advance up to MWK 500,000
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      No collateral required
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Instant approval for salaried employees
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-10 rounded-3xl">
                  <div className="flex items-center mb-6">
                    <Building className="h-10 w-10 mr-4" />
                    <h2 className="text-2xl font-bold">For Businesses</h2>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      SME loans up to MWK 1,500,000
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Payroll financing solutions
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Business expansion capital
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">VaultString</h3>
                <p className="text-gray-600 text-sm">
                  Instant credit solutions for salaried professionals and SMEs.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Products</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-blue-600">Salary Advance</a></li>
                  <li><a href="#" className="hover:text-blue-600">SME Loans</a></li>
                  <li><a href="#" className="hover:text-blue-600">Business Credit</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                  <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                  <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-blue-600">Compliance</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} VaultString. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}