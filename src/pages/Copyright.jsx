import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Intellectual Property Policy</h1>
          <p className="text-lg text-gray-600">Our policy for handling claims of copyright and trademark infringement.</p>
        </div>

        <Card className="material-shadow">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-gray-700">
                DripCharts LLC ("Company") has adopted the following policy for handling claims of intellectual property infringement in accordance with the Digital Millennium Copyright Act (DMCA) and applicable trademark laws. The contact information for Company's Designated Agent to Receive Notification of Claimed Infringement ("Designated Agent") is listed at the end of this policy.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Policy</h2>
                <p className="text-gray-700 mb-4">DripCharts is committed to protecting intellectual property rights while supporting legitimate music sharing and discovery. Our policy is to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Remove or disable access to material that we believe in good faith infringes third-party intellectual property rights (including copyrights, trademarks, and other proprietary rights)</li>
                  <li>Terminate repeat offenders from our platform</li>
                  <li>Maintain chart integrity by removing infringing content from rankings and discovery features</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Repeat Infringer Policy</h2>
                <p className="text-gray-700 mb-4">A repeat infringer is defined as a user for whom DripCharts has:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Received more than two valid infringement notices, OR</li>
                  <li>Removed infringing content more than twice</li>
                </ul>
                <p className="text-gray-700">Repeat infringers will have their accounts terminated and all content removed from charts and rankings. DripCharts reserves the right to immediately terminate accounts for egregious infringement activities at our sole discretion.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Impact on Charts and Rankings</h2>
                <p className="text-gray-700 mb-4">When infringing content is removed:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>The content is immediately removed from all charts and rankings</li>
                  <li>Chart positions are recalculated without the infringing material</li>
                  <li>Associated user engagement metrics are adjusted accordingly</li>
                  <li>The content cannot be re-uploaded or re-ranked</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Reporting Copyright Infringement</h2>
                <p className="text-gray-700 mb-4">If you believe content on DripCharts infringes your copyright, send a takedown notice to our Designated Agent containing only the following information:</p>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Required Information:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Signature:</strong> Physical or electronic signature of the copyright owner or authorized representative</li>
                    <li><strong>Identification of copyrighted work:</strong> Description of the copyrighted work being infringed</li>
                    <li>
                      <strong>Identification of infringing material:</strong> Specific identification of the infringing content on DripCharts, including:
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Direct URLs to the infringing content</li>
                        <li>Artist name and song/album title</li>
                        <li>Chart or playlist location (if applicable)</li>
                        <li>Sufficient detail for us to locate and verify the content</li>
                      </ul>
                    </li>
                    <li><strong>Contact information:</strong> Your address, telephone number, and email address</li>
                    <li><strong>Good faith statement:</strong> "I swear under penalty of perjury that I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed, and that the information in this notification is accurate. I have a good faith belief that use of the copyrighted materials described above as allegedly infringing is not authorized by the copyright owner, its agent, or the law."</li>
                  </ul>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Important Notes:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li><strong>Liability warning:</strong> You may be liable for damages, including costs and attorneys' fees, if you materially misrepresent that content is infringing</li>
                      <li><strong>Complete information only:</strong> Please include only the required information above</li>
                      <li><strong>Copy forwarded:</strong> A copy of your notice will be sent to the user who posted the allegedly infringing content</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Reporting Trademark Infringement</h2>
                <p className="text-gray-700 mb-4">For trademark infringement claims, follow the same process as copyright but use this statement instead:</p>
                <blockquote className="bg-gray-100 p-4 rounded-lg border-l-4 border-gray-300">
                  <p className="text-gray-700 italic"><strong>Trademark statement:</strong> "I swear under penalty of perjury that I am the trademark owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed, and that the information in this notification is accurate. I have a good faith belief that use of the materials described above as allegedly infringing is not authorized by the intellectual property owner, its agent, or the law."</p>
                </blockquote>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Response to Valid Takedown Notices</h2>
                <p className="text-gray-700 mb-4">Upon receiving a valid infringement notice, DripCharts will:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Remove or disable access to the allegedly infringing material</li>
                  <li>Remove content from charts and recalculate rankings</li>
                  <li>Notify the user who posted the content that it has been removed</li>
                  <li>Document the infringement for repeat offender tracking</li>
                  <li>Terminate repeat offenders as outlined in our policy</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Counter-Notice Procedure</h2>
                <p className="text-gray-700 mb-4">If you believe your content was removed in error or you have the right to use the material, you may submit a counter-notice containing:</p>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Required Counter-Notice Information:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Your signature:</strong> Physical or electronic signature</li>
                    <li><strong>Identification of removed material:</strong> Description of the content that was removed and where it appeared on DripCharts</li>
                    <li><strong>Good faith belief statement:</strong> Statement that you believe the material was removed due to mistake or misidentification</li>
                    <li><strong>Contact information:</strong> Your name, address, telephone number, and email address</li>
                    <li><strong>Consent to jurisdiction:</strong> Statement consenting to jurisdiction of Federal Court in your district (or any district where DripCharts is located if you're outside the US) and agreement to accept service of process from the original complainant</li>
                  </ul>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Counter-Notice Process:</h3>
                   <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>We may send a copy of your counter-notice to the original complainant</li>
                      <li>If the complainant doesn't file a court action within 10 business days, we may restore the content in 10-14 business days</li>
                      <li>Restored content will be re-eligible for charts and rankings</li>
                      <li>Counter-notices are processed at DripCharts' discretion</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Music-Specific Considerations</h2>
                <h3 className="font-semibold text-lg text-gray-800 mt-4 mb-2">Cover Songs and Remixes:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Cover songs require proper mechanical licensing</li>
                  <li>Remixes and derivative works require permission from original copyright holders</li>
                  <li>Uploading covers or remixes without proper licensing may result in removal</li>
                </ul>
                <h3 className="font-semibold text-lg text-gray-800 mt-4 mb-2">Sampling:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All samples must be properly licensed or qualify for fair use</li>
                  <li>Unlicensed sampling will result in content removal</li>
                  <li>Users are responsible for clearing all samples before upload</li>
                </ul>
                <h3 className="font-semibold text-lg text-gray-800 mt-4 mb-2">AI-Generated Content:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>AI-generated music using copyrighted training data without authorization is prohibited</li>
                  <li>AI-generated content must be clearly labeled</li>
                  <li>Users must ensure AI tools used have proper licensing for any copyrighted material</li>
                </ul>
                <h3 className="font-semibold text-lg text-gray-800 mt-4 mb-2">Chart Manipulation:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Using copyrighted content to artificially inflate chart positions is prohibited</li>
                  <li>Infringing content cannot be used to boost other songs' rankings</li>
                  <li>Chart manipulation combined with infringement may result in immediate account termination</li>
                </ul>
              </section>
              
               <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Educational Resources</h2>
                <p className="text-gray-700">DripCharts provides resources to help users understand:</p>
                 <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Copyright basics for musicians</li>
                    <li>Proper licensing procedures</li>
                    <li>Fair use guidelines</li>
                    <li>How to obtain mechanical licenses for covers</li>
                  </ul>
              </section>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}