import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">DripCharts Privacy Policy</h1>
          <p className="text-lg text-gray-600">Effective Date: August 20, 2025</p>
        </div>

        <Card className="material-shadow">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-gray-700">
                DripCharts LLC ("DripCharts," "we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, share, and safeguard your personal data when you access the www.dripcharts.com website, mobile applications, and any other linked pages, features, content, or services offered by DripCharts (collectively, the "Service"), or otherwise interact with us.
              </p>
              <p className="text-gray-700">
                This policy does not apply to third-party companies or services that DripCharts does not own or control. "Personal Data" means any data related to an identified or identifiable individual. By accessing or using the Service, you acknowledge that you accept the practices and policies outlined in this Privacy Policy.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What Personal Data Does DripCharts Collect?</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Information You Provide Directly:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>User Account Information:</strong> Name, username, password, email address, profile photo or avatar, user bio and location, music preferences and genre tags, chart creation history and activity, follower/following relationships, purchase and subscription history.</li>
                  <li><strong>Financial Information:</strong> Credit or debit card information (processed by our payment processors), bank account details for artist payouts, billing and shipping addresses, subscription and payment history, payout information for artists.</li>
                  <li><strong>Artist-Specific Information:</strong> Artist biography and band information, music metadata (song titles, albums, genres, release dates), promotional materials and press kit information, performance analytics preferences, chart submission preferences.</li>
                  <li><strong>Content and Communications:</strong> Music files and audio content you upload, chart descriptions and playlist information, comments, reviews, and ratings, messages between users, customer support communications, newsletter subscriptions and preferences.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">Information We Collect Automatically:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Platform Activity Information:</strong> Chart creation and curation activity, music listening history and preferences, user engagement metrics (plays, likes, shares), search queries and discovery patterns, time spent on different sections of the platform, chart performance and ranking data.</li>
                    <li><strong>Technical Information:</strong> IP address and device identifiers, browser type and version, operating system information, page views and click-through data, access times and session duration, application logs and error reports.</li>
                    <li><strong>Cookies and Tracking Technologies:</strong> Session cookies for platform functionality, preference cookies for user settings, analytics cookies for performance monitoring, third-party cookies from integrated services.</li>
                    <li><strong>Interactive Features:</strong> Mouse movements, clicks, and scrolling behavior, response times and user interface interactions, feature usage patterns, music discovery pathways.</li>
                </ul>
                <p className="text-gray-700">
                    We use Google Analytics to collect analytical data about platform usage. Google Analytics tracks interactions with DripCharts and stores information about IP addresses, operating systems, web browsers, pages visited, demographic information, devices used, and traffic sources. You can learn about Google's practices at <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.google.com/policies/privacy/partners/</a> and opt out by downloading the Google Analytics opt-out browser add-on at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://tools.google.com/dlpage/gaoptout</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How Does DripCharts Use Your Personal Data?</h2>
                 <p className="text-gray-700 mb-4">We use your Personal Data for the following purposes:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Core Platform Services:</strong> Creating and managing your user account and profile, enabling music uploads, chart creation, and playlist management, processing chart rankings and algorithm calculations, facilitating user interactions and community features, providing music streaming and discovery services.</li>
                    <li><strong>Business Operations:</strong> Processing payments and managing subscriptions, artist payout processing and financial reporting, customer support and technical assistance, platform security and fraud prevention, legal compliance and regulatory requirements.</li>
                    <li><strong>Analytics and Improvement:</strong> Analyzing platform usage and user behavior, improving chart algorithms and recommendation systems, optimizing music discovery features, developing new platform capabilities, measuring chart performance and engagement.</li>
                    <li><strong>Communications:</strong> Sending platform notifications and updates, marketing communications (with your consent), newsletter and promotional content, artist promotional opportunities, security alerts and important notices.</li>
                    <li><strong>Legal and Safety:</strong> Enforcing our Terms of Service and policies, investigating and preventing fraud or abuse, protecting user safety and platform integrity, complying with legal obligations, responding to law enforcement requests.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">When Does DripCharts Collect Personal Data?</h2>
                <p className="text-gray-700 mb-4">We collect Personal Data when:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You create an account or update your profile</li>
                    <li>You upload music or create charts and playlists</li>
                    <li>You interact with other users' content</li>
                    <li>You use our search and discovery features</li>
                    <li>You make purchases or manage subscriptions</li>
                    <li>You contact customer support</li>
                    <li>You participate in promotional activities</li>
                    <li>We have a legitimate business interest (such as security or analytics)</li>
                    <li>Required by law or regulation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How Does DripCharts Share Personal Data?</h2>
                <p className="text-gray-700 mb-4">We do not sell or rent your Personal Data. We share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Within DripCharts:</strong> With our employees and contractors who need access to provide services, with affiliated companies under common ownership, during business transfers, mergers, or acquisitions.</li>
                    <li><strong>Service Providers:</strong> Payment processors for transaction handling, cloud storage and hosting providers, analytics and performance monitoring services, customer support and communication tools, marketing and email service providers.</li>
                    <li><strong>Artists and Community Features:</strong> Chart and playlist information is publicly visible, user profiles may display certain information to other users, fan information (email, location) may be shared with artists you follow (with your consent), aggregate listening data for artist analytics.</li>
                    <li><strong>Legal Requirements:</strong> Law enforcement agencies when required by law, court orders, subpoenas, or legal processes, fraud prevention and platform security, protection of rights, property, or safety.</li>
                    <li><strong>With Your Consent:</strong> Third-party integrations you authorize, social media sharing features, marketing partnerships you opt into.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security and Storage</h2>
                <p className="text-gray-700 mb-4">DripCharts implements comprehensive security measures to protect your Personal Data:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Technical Safeguards:</strong> Encryption of data in transit and at rest, secure server infrastructure and databases, regular security audits and vulnerability assessments, access controls and authentication systems.</li>
                  <li><strong>Operational Safeguards:</strong> Employee training on data protection, limited access to Personal Data on a need-to-know basis, incident response and breach notification procedures, regular backup and disaster recovery processes.</li>
                </ul>
                <h3 className="font-semibold text-lg text-gray-800 mt-4 mb-2">Storage Duration:</h3>
                <p className="text-gray-700 mb-4">We retain Personal Data only as long as necessary to:</p>
                 <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Provide our services and maintain your account</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Support business operations and analytics</li>
                </ul>
                <p className="text-gray-700">When data is no longer needed, we securely delete or anonymize it according to our data retention schedule.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Privacy Rights and Choices</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Account Management:</strong> Update your profile information and preferences, control privacy settings for your charts and playlists, manage email and notification preferences, download your personal data, delete your account and associated data.</li>
                    <li><strong>Marketing Communications:</strong> Opt out of promotional emails using unsubscribe links, manage newsletter subscriptions, control targeted advertising preferences.</li>
                    <li><strong>Data Subject Rights:</strong> Subject to applicable law, you may have the right to: access the Personal Data we hold about you, correct inaccurate or incomplete information, delete your Personal Data (subject to certain limitations), object to or restrict processing of your data, data portability for certain information, withdraw consent for processing based on consent.</li>
                    <li><strong>California Privacy Rights:</strong> California residents have additional rights under the California Consumer Privacy Act (CCPA), including: right to know what Personal Data is collected, right to delete Personal Data, right to opt out of the sale of Personal Data (we don't sell data), right to non-discrimination for exercising privacy rights.</li>
                    <li><strong>Cookie Controls:</strong> Most browsers allow you to control cookie settings, you can block or delete cookies, though this may limit platform functionality, opt out of Google Analytics using their browser add-on.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
                <p className="text-gray-700 mb-4">DripCharts does not knowingly collect Personal Data from children under 16 years of age. Our Service is not directed to children under 16. If we learn that we have collected Personal Data from a child under 16, we will promptly delete such information and terminate the account.</p>
                <p className="text-gray-700">If you believe a child has provided us with Personal Data, please contact us immediately at privacy@dripcharts.com.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">International Data Transfers</h2>
                <p className="text-gray-700 mb-4">Your information may be transferred to and processed in the United States or other countries where we or our service providers operate. These countries may have different data protection laws than your country of residence.</p>
                <p className="text-gray-700 mb-4">We implement appropriate safeguards for international transfers, including:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Standard contractual clauses</li>
                    <li>Adequacy decisions by relevant authorities</li>
                    <li>Other legally recognized transfer mechanisms</li>
                </ul>
                <p className="text-gray-700 mt-4">By using DripCharts, you consent to the transfer of your information to these countries.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-700 mb-4">We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Update the "Effective Date" at the top of this policy</li>
                    <li>Notify you through the platform or via email for material changes</li>
                    <li>Provide you with the opportunity to review the updated policy</li>
                </ul>
                 <p className="text-gray-700 mt-4">Your continued use of DripCharts after any changes constitutes acceptance of the updated Privacy Policy.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">If you have questions, concerns, or requests regarding your privacy or this Privacy Policy, please contact us:</p>
                <ul className="list-none space-y-2 text-gray-700">
                  <li><strong>Email:</strong> privacy@dripcharts.com</li>
                  <li><strong>Subject Line:</strong> Please specify your request type (e.g., "Data Access Request," "Privacy Question," "California Privacy Rights")</li>
                  <li><strong>Mailing Address:</strong></li>
                  <li className="ml-4">DripCharts LLC</li>
                  <li className="ml-4">[Your Business Address]</li>
                  <li className="ml-4">[City, State, ZIP Code]</li>
                </ul>
                 <p className="text-gray-700 mt-4">We will respond to your inquiries and requests within a reasonable timeframe as required by applicable law.</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}