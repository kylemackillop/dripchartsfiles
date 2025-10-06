import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Use</h1>
          <p className="text-lg text-gray-600">Legal terms governing your use of DripCharts</p>
        </div>

        <Card className="material-shadow">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Last updated: [Date]. These Terms of Use govern your access to and use of DripCharts.
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceptance of Terms</h2>
                  <p className="text-gray-700">
                    By accessing or using DripCharts, you agree to be bound by these Terms of Use and our Privacy Policy. 
                    If you do not agree to these terms, please do not use our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Description of Service</h2>
                  <p className="text-gray-700">
                    DripCharts is a music discovery platform that allows users to upload, share, discover, and rank music. 
                    We provide tools for artists to build audiences and for listeners to discover new music through community-driven charts.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">User Accounts</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You must be at least 18 years old to create an account</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>You must provide accurate and complete information</li>
                    <li>One person may only maintain one account</li>
                    <li>Account sharing is prohibited</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Content and Intellectual Property</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You retain ownership of content you upload</li>
                    <li>You grant us a license to display, distribute, and promote your content</li>
                    <li>You must have rights to all content you upload</li>
                    <li>We may remove content that violates these terms</li>
                    <li>Respect others' intellectual property rights</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Prohibited Uses</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Illegal activities or content</li>
                    <li>Harassment, bullying, or hate speech</li>
                    <li>Spam or excessive self-promotion</li>
                    <li>Manipulating votes or charts</li>
                    <li>Attempting to hack or compromise the platform</li>
                    <li>Violating others' rights or privacy</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscriptions and Payments</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Subscription fees are charged in advance</li>
                    <li>You may cancel your subscription at any time</li>
                    <li>Refunds are provided according to our refund policy</li>
                    <li>Prices may change with reasonable notice</li>
                    <li>Payment information must be current and accurate</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Disclaimers</h2>
                  <p className="text-gray-700">
                    DripCharts is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service, 
                    accuracy of content, or that the platform will meet your specific needs. Use of the platform is at your own risk.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
                  <p className="text-gray-700">
                    To the maximum extent permitted by law, DripCharts shall not be liable for any indirect, incidental, 
                    special, consequential, or punitive damages arising from your use of the platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Termination</h2>
                  <p className="text-gray-700">
                    We may terminate or suspend your account immediately if you violate these terms. Upon termination, 
                    your right to use the platform ceases, and we may delete your account and content.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
                  <p className="text-gray-700">
                    We may modify these terms at any time. Continued use of the platform after changes constitutes 
                    acceptance of the new terms. We will provide notice of significant changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
                  <p className="text-gray-700">
                    For questions about these Terms of Use, contact us at{" "}
                    <a href="mailto:legal@dripcharts.com" className="text-primary hover:underline">
                      legal@dripcharts.com
                    </a>.
                  </p>
                </section>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}