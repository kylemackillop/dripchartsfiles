import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Heart, Shield, TrendingUp, Zap } from "lucide-react";

const PrincipleCard = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
        <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

export default function FairTradeMusicPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Fair Trade Music Policy</h1>
          <p className="text-lg text-gray-600">Our commitment to a fair, transparent, and artist-first ecosystem.</p>
        </div>

        <Card className="material-shadow mb-8">
          <CardHeader>
            <CardTitle>Our Philosophy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p>
              DripCharts was founded on a simple principle: great music deserves to be heard. We are committed to building a platform where an artist's success is determined by the quality of their music and the passion of their fans, not by marketing budgets or industry connections. This Fair Trade Music Policy outlines our approach to creating a level playing field for every artist.
            </p>
          </CardContent>
        </Card>
        
        <Card className="material-shadow">
            <CardHeader>
                <CardTitle>How Our Charts Work: A Transparent Approach</CardTitle>
                 <p className="text-gray-600 pt-2">Our chart rankings are calculated using a hybrid approach that rewards genuine engagement and quality. We don't rely on a single metric; instead, our system considers multiple factors to create a holistic and fair view of a track's performance.</p>
            </CardHeader>
          <CardContent className="space-y-8">
            
            <PrincipleCard 
              icon={Heart}
              title="Base Score: Quality Over Quantity"
              description="We use a sophisticated method (a Bayesian average) to calculate a track's base rating. This prevents songs with only a few 5-star ratings from unfairly dominating songs with many positive ratings, ensuring a more statistically sound score."
            />

            <PrincipleCard 
              icon={Zap}
              title="Engagement Multiplier: Beyond the Vote"
              description="A rating is just one piece of the puzzle. We amplify a track's score based on genuine listener engagement, including how many times it's played, shared, and added to user playlists. Active engagement is a strong signal of a great song."
            />

            <PrincipleCard 
              icon={TrendingUp}
              title="Time Decay: What's Hot Now"
              description="To keep the charts fresh and dynamic, recent activity is weighted more heavily. This gives new tracks a fair chance to trend and ensures the charts reflect what the community is excited about right now, while still honoring established favorites."
            />

            <PrincipleCard 
              icon={Scale}
              title="Genre Normalization: A Level Playing Field"
              description="We understand that different genres have different listening patterns. Our system adjusts scores to account for these nuances, ensuring that a niche metal track can be judged on its own merits alongside a trending pop song."
            />

            <PrincipleCard 
              icon={Shield}
              title="Anti-Gaming & Fairness Measures"
              description="Maintaining the integrity of our charts is our highest priority. We employ several measures to prevent manipulation, including minimum rating thresholds for chart entry, flagging unusual rating spikes, and giving more weight to ratings from established, trusted members of the DripCharts community."
            />
          
          </CardContent>
        </Card>

        <Card className="material-shadow mt-8">
          <CardHeader>
            <CardTitle>Our Promise to Artists</CardTitle>
          </CardHeader>
           <CardContent className="prose prose-lg max-w-none">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Equal Opportunity:</strong> All artists have the same chance to reach our audience.</li>
                    <li><strong>Your Rights:</strong> You always retain full ownership of your music.</li>
                    <li><strong>Clear Analytics:</strong> We provide you with the data you need to understand your audience.</li>
                    <li><strong>No Pay-to-Play:</strong> You can't buy your way to the top of our charts.</li>
                </ul>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}