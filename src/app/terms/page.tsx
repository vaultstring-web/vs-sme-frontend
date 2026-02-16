// app/terms/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | VaultString Thrive',
  description: 'Official terms and conditions for VaultString Thrive microfinance products – payroll lending, SME working capital, and invoice discounting.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            VaultString Thrive – transparent, fair, and compliant microfinance.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <section className="mt-12 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Introduction</h2>
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              VaultString Thrive is a licensed microfinance institution operating under the 
              Reserve Bank of Malawi (RBM) Microfinance Act (2010) and subsequent directives. 
              We provide accessible, technology‑enabled credit to salaried employees and 
              registered small‑to‑medium enterprises (SMEs) in Malawi.
            </p>
            <p>
              By applying for or using any of our financial products, you agree to be bound 
              by these Terms and Conditions. Please read them carefully. All loans are subject 
              to credit approval, affordability checks, and compliance with RBM’s responsible 
              lending guidelines.
            </p>
          </div>
        </section>

        {/* Eligibility */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Eligibility</h2>
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
            <h3 className="font-semibold text-gray-900 dark:text-white">For Payroll Loans</h3>
            <ul className="list-inside list-disc space-y-2">
              <li>Malawian citizen or resident with valid National ID.</li>
              <li>Formally employed by a registered private or public sector employer partnered with VaultString Thrive.</li>
              <li>Minimum three months’ employment history with current employer.</li>
              <li>Net monthly salary of at least MWK 150,000 (or as determined by affordability).</li>
              <li>Consent to a credit reference bureau (CRB) check (fee MWK 2,900 per inquiry).</li>
            </ul>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">For SME Products</h3>
            <ul className="list-inside list-disc space-y-2">
              <li>Business registered in Malawi (certificate of incorporation or business registration).</li>
              <li>Operational for at least six months.</li>
              <li>Proof of turnover or active purchase orders/invoices for the requested financing.</li>
              <li>Valid business bank account or mobile money wallet.</li>
            </ul>
          </div>
        </section>

        {/* Loan Products */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Loan Products & Terms</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Payroll Lending */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/30">
              <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">Payroll Lending</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p><span className="font-medium text-gray-900 dark:text-white">Loan amount:</span> MWK 100,000 – MWK 500,000</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Repayment term:</span> 3 – 12 months</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Interest rate:</span> 6% – 7.5% per month (declining balance)</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Processing fee:</span> 10% – 12% of loan amount (deducted upfront)</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Credit life insurance:</span> 1.2% of loan amount (mandatory, single premium)</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Repayment method:</span> Payroll deduction via employer’s HR/payroll system.</p>
                <p className="mt-2 text-xs italic">Minimum salary advance of MWK 50,000 may be available for existing customers.</p>
              </div>
            </div>

            {/* SME Working Capital */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/30">
              <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">SME Working Capital</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p><span className="font-medium text-gray-900 dark:text-white">Loan amount:</span> MWK 500,000 – MWK 5,000,000</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Repayment term:</span> 3 – 12 months</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Interest rate:</span> 6.5% per month (declining balance)</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Processing fee:</span> 13.2% of loan amount</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Security:</span> May require personal guarantee or collateral for larger amounts.</p>
              </div>
            </div>

            {/* Order Finance / Invoice Discounting */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/30 md:col-span-2">
              <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">Order Finance & Invoice Discounting</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order Finance</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>Amount: MWK 1,000,000 – MWK 10,000,000</li>
                    <li>Term: Up to 90 days (aligned with order fulfilment)</li>
                    <li>Interest: 7.5% per month (declining)</li>
                    <li>Fee: 12% of financed amount</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Invoice Discounting</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>Advance rate: Up to 80% of eligible invoice value</li>
                    <li>Term: Until invoice maturity (max 90 days)</li>
                    <li>Interest: 7.5% per month on drawn amount</li>
                    <li>Fee: 12% of invoice value (one‑time)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fees & Charges Summary */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Fees & Other Charges</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="border-b border-gray-200 bg-gray-100 text-xs uppercase text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">Fee Type</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">Credit Reference Bureau (CRB)</td>
                  <td className="px-6 py-4">MWK 2,900 per inquiry</td>
                  <td className="px-6 py-4">Paid by client, non‑refundable</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">Late Payment Penalty</td>
                  <td className="px-6 py-4">5% of overdue amount + interest continues to accrue</td>
                  <td className="px-6 py-4">After 7 days past due date</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">Early Settlement</td>
                  <td className="px-6 py-4">No penalty; interest rebated on a pro‑rata basis</td>
                  <td className="px-6 py-4">Request in writing</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Loan Restructuring</td>
                  <td className="px-6 py-4">2% of outstanding balance</td>
                  <td className="px-6 py-4">Subject to approval</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Repayment & Default */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Repayment, Default & Collections</h2>
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Repayment:</span> Payroll loans are repaid via automatic salary deduction. 
              SME clients must ensure funds are available in their designated account on the due date. 
              VaultString Thrive also accepts repayments via Airtel Money, Mpamba, or bank transfer.
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Default:</span> An account is considered delinquent if payment is not received within 7 days of the due date. 
              After 30 days, the full outstanding balance becomes immediately due. We will report defaulted accounts to the CRB, 
              which may affect your future creditworthiness.
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Collections:</span> We employ fair, ethical collection practices. 
              Persistent default may result in legal action to recover the debt. All collection costs will be borne by the client.
            </p>
          </div>
        </section>

        {/* Privacy & Data Protection */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Privacy & Data Protection</h2>
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              VaultString Thrive is committed to protecting your personal data in accordance with Malawi’s 
              Data Protection Act and our internal privacy policy. We collect, store, and process your information 
              solely for loan origination, credit assessment, portfolio monitoring, and regulatory reporting.
            </p>
            <p>
              By accepting these terms, you consent to: (i) CRB searches; (ii) sharing of your loan performance 
              with credit bureaus; (iii) use of your data for statistical and risk analysis; and (iv) receiving 
              marketing communications (you may opt out at any time). We do not sell your data to third parties.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Limitation of Liability</h2>
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              To the fullest extent permitted by Malawian law, VaultString Thrive shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages arising out of or related to 
              your use of our services, even if advised of the possibility of such damages. Our total liability 
              in connection with any loan shall not exceed the principal amount advanced.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Governing Law & Dispute Resolution</h2>
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              These Terms and Conditions are governed by the laws of the Republic of Malawi. Any dispute arising 
              from or in connection with this agreement shall first be submitted to mediation under the auspices of 
              the Malawi Microfinance Network (MAMN). If mediation fails, the matter shall be referred to the 
              courts of Malawi, specifically the Magistrate Court in Lilongwe.
            </p>
          </div>
        </section>

        {/* Amendments */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. Amendments</h2>
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              VaultString Thrive reserves the right to amend these Terms and Conditions at any time. 
              Changes will be communicated via our website or through direct notice. Continued use of our 
              services after such changes constitutes acceptance of the revised terms.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800/50 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">10. Contact Us</h2>
          <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <p>
              <span className="font-medium text-gray-900 dark:text-white">VaultString Thrive</span><br />
              Area 4, Lilongwe, Malawi<br />
              Email: <a href="mailto:thrive@vaultstring.com" className="text-primary-600 hover:underline dark:text-primary-400">thrive@vaultstring.com</a><br />
              Phone: +265 (0) 1 234 567<br />
              Website: <a href="https://thrive.vaultstring.com" className="text-primary-600 hover:underline dark:text-primary-400">https://thrive.vaultstring.com</a>
            </p>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <div className="mt-12 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>
            VaultString Thrive is regulated by the Reserve Bank of Malawi. All loans are subject to affordability 
            assessment and approval. Terms may change in line with RBM directives.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} VaultString Thrive. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}