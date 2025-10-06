import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">DripCharts Acceptable Use Policy</h1>
          <p className="text-lg text-gray-600">Guidelines for using DripCharts responsibly and safely</p>
        </div>

        <Card className="material-shadow">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What is an Acceptable Use Policy?</h2>
                <p className="text-gray-700 leading-relaxed">
                  This policy sets out the "Content Standards" that apply when you upload music or content to DripCharts, create charts or playlists, interact with other users, or use our platform in any way. It also outlines when we may remove content or disable accounts, and your rights if you disagree with our actions. This policy is part of our User Terms and should be read alongside those terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Prohibited Uses</h2>
                <p className="text-gray-700 mb-4">You may not use DripCharts:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>If you are under 18 years old</li>
                  <li>In any way that violates applicable local, national, or international laws or regulations</li>
                  <li>In any way that is unlawful, fraudulent, or has unlawful or fraudulent purposes</li>
                  <li>To harm or attempt to harm minors in any way</li>
                  <li>To bully, insult, intimidate, or humiliate any person</li>
                  <li>To upload, share, or distribute content that violates our Content Standards</li>
                  <li>To send spam, unsolicited advertising, or promotional material</li>
                  <li>To transmit viruses, malware, or any harmful code that could damage our platform or users' devices</li>
                  <li>For child sexual exploitation or abuse</li>
                  <li>For exploitation of people in violent or sexual ways</li>
                  <li>For commercial activities like contests or advertising without our written consent</li>
                  <li>To upload terrorist content</li>
                  <li>To manipulate charts, rankings, or engagement metrics through artificial means</li>
                </ul>

                <p className="text-gray-700 mb-4">You also agree not to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Reproduce, copy, or resell any part of DripCharts without permission</li>
                  <li>Access, interfere with, damage, or disrupt our platform, servers, or networks</li>
                  <li>Use automated tools (bots, scrapers, crawlers) to extract data from our platform</li>
                  <li>Mine data or content from our site</li>
                  <li>Train AI or machine learning models using content from DripCharts</li>
                  <li>Create or use unauthorized AI tools that incorporate copyrighted content without permission</li>
                  <li>Create digital fingerprints of content on our platform</li>
                  <li>Artificially inflate play counts, chart positions, or engagement metrics</li>
                  <li>Create fake accounts or engage in coordinated inauthentic behavior</li>
                  <li>Share login credentials or allow others to use your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Standards</h2>
                <p className="text-gray-700 mb-4">
                  These standards apply to all content you contribute to DripCharts, including music uploads, chart descriptions, comments, and profile information.
                </p>
                <p className="text-gray-700 mb-4">
                  All content standards must be followed both in letter and spirit. DripCharts will determine, at our discretion, whether content violates these standards.
                </p>

                <div className="bg-green-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">All Content Must:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Be accurate when stating facts</li>
                    <li>Contain only genuinely held opinions</li>
                    <li>Comply with laws in countries where it's posted and accessed</li>
                    <li>Be music-related content that users would expect to find on our platform</li>
                    <li>Respect intellectual property rights and licensing requirements</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">No Content May:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Be defamatory, obscene, offensive, hateful, or inflammatory</li>
                    <li>Bully, insult, intimidate, or humiliate others</li>
                    <li>Encourage self-harm, suicide, or eating disorders</li>
                    <li>Contain sexually explicit material</li>
                    <li>Involve exploitation of people in violent or sexual ways</li>
                    <li>Include child sexual abuse material</li>
                    <li>Incite violence or hatred against specific groups</li>
                    <li>Promote discrimination based on race, sex, religion, nationality, disability, sexual orientation, or age</li>
                    <li>Include terrorist-related content</li>
                    <li>Infringe copyright, trademark, or other intellectual property rights</li>
                    <li>Deceive or mislead users</li>
                    <li>Breach legal duties to third parties</li>
                    <li>Contain illegal content or promote illegal activities</li>
                    <li>Threaten, abuse, or invade privacy</li>
                    <li>Harass, upset, embarrass, or annoy other users</li>
                    <li>Impersonate others or misrepresent your identity</li>
                    <li>Give the false impression that content comes from DripCharts</li>
                    <li>Encourage or assist unlawful activities</li>
                    <li>Contain advertising (except where explicitly permitted)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Music-Specific Standards:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>You must own the rights to upload any music content</li>
                    <li>You must not upload music that infringes on others' copyrights</li>
                    <li>Cover songs must comply with applicable licensing requirements</li>
                    <li>Sampling must be properly licensed or fall under fair use</li>
                    <li>AI-generated music must be clearly labeled and not infringe on existing copyrights</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Chart and Ranking Integrity:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Charts and rankings must reflect genuine user engagement</li>
                    <li>You may not artificially manipulate your chart position through fake plays or ratings</li>
                    <li>Chart descriptions must be accurate and not misleading</li>
                    <li>You may not coordinate with others to artificially boost rankings</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Enforcement Actions</h2>
                <p className="text-gray-700 mb-4">
                  When we believe this policy has been violated, we may take appropriate action while respecting freedom of expression and ensuring DripCharts remains safe for all users. All moderation decisions are made by humans, not algorithms.
                </p>
                <p className="text-gray-700 mb-4">Violations may result in:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Warning notifications</li>
                  <li>Temporary or permanent content removal</li>
                  <li>Temporary or permanent account suspension</li>
                  <li>Removal from charts and rankings</li>
                  <li>Loss of premium features</li>
                  <li>Legal action for costs and damages</li>
                  <li>Disclosure to law enforcement when required by law</li>
                </ul>
                <p className="text-gray-700">
                  If we remove content or disable your account, we'll provide a Statement of Reasons explaining our decision. We'll also provide statements to users who report content, explaining whether we took action.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights and Appeals Process</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Reporting Content:</h3>
                <p className="text-gray-700 mb-2">If you find content that violates this policy, you can report it by:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Using the "report" button on content or user profiles</li>
                  <li>Emailing support@dripcharts.com with the URL and policy violation details</li>
                </ul>
                <p className="text-gray-700 mb-6">Our human review team will investigate and provide a Statement of Reasons for our decision.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Appeal Process:</h3>
                <p className="text-gray-700 mb-4">If your content was removed or account suspended and you believe this was incorrect:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Initial Appeal:</strong> Email support@dripcharts.com within 6 months explaining why you believe our decision was wrong. Our legal team will review and respond within 8 weeks.</li>
                  <li><strong>Management Review:</strong> If unsatisfied with the initial response, email appeals@dripcharts.com for senior management review. Response within 8 weeks.</li>
                  <li><strong>External Dispute Resolution:</strong> EU citizens may access certified out-of-court dispute settlement bodies when available.</li>
                  <li><strong>Legal Action:</strong> You may pursue claims in court if other options don't resolve the matter.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Special Considerations for DripCharts</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Chart Manipulation Prevention:</h3>
                <p className="text-gray-700 mb-4">
                  DripCharts uses sophisticated detection systems to identify artificial engagement. Attempting to manipulate charts through fake plays, coordinated rating campaigns, or other artificial means will result in chart removal and potential account suspension.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Guidelines:</h3>
                <p className="text-gray-700 mb-4">
                  Our platform thrives on authentic music discovery and community engagement. Users are expected to engage genuinely with content and contribute positively to the music discovery ecosystem.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Artist Verification:</h3>
                <p className="text-gray-700 mb-4">
                  Verified artists have additional responsibilities to maintain accurate profile information and comply with promotional guidelines.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Protection:</h3>
                <p className="text-gray-700 mb-4">
                  We're committed to protecting user privacy while enabling music discovery. This policy works alongside our Privacy Policy to ensure responsible data handling.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Updates to This Policy</h2>
                <p className="text-gray-700">
                  We may update this policy periodically. Continued use of DripCharts after changes constitutes acceptance of the updated policy. We'll notify users of significant changes.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}