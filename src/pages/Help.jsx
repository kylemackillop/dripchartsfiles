import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Music, Upload, TrendingUp, User, Headphones, Star, List } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      category: "Getting Started",
      icon: User,
      questions: [
        { 
          q: "What's the difference between account types?", 
          a: "Listener accounts can listen and create playlists. Artist accounts can upload music and access artist tools. Professional accounts can manage multiple artists and access advanced analytics." 
        },
        { 
          q: "How do I upgrade my account?", 
          a: "Visit the Pricing page and select the plan that's right for you. You can upgrade anytime from your Billing Info page." 
        },
        { 
          q: "How do the charts work?", 
          a: "Charts are based on community ratings, engagement, and listening activity. Higher ratings and more authentic engagement improve chart position." 
        }
      ]
    },
    {
      category: "Discovering Music",
      icon: Headphones,
      questions: [
        { 
          q: "How do I discover new music?", 
          a: "Use the Discover page to browse by genre, check out trending charts, or explore curated playlists. You can also follow artists you like." 
        },
        { 
          q: "How do I create a playlist?", 
          a: "Click the '+' button next to any song to add it to a playlist. You can create new playlists or add to existing ones from your profile." 
        },
        { 
          q: "How do I rate songs?", 
          a: "Click on any song to view its details page, then use the star rating system to rate from 1-5 stars. Your ratings help shape the charts!" 
        },
        { 
          q: "Can I follow my favorite artists?", 
          a: "Yes! Visit any artist's profile and click 'Follow' to get notified when they release new music or climb the charts." 
        }
      ]
    },
    {
      category: "For Artists",
      icon: Upload,
      questions: [
        { 
          q: "How do I upload a song?", 
          a: "Go to your Artist Dashboard, click the 'Your Songs' tab, then '+ Add a new song'. Upload your audio file, add cover art, and fill in the details." 
        },
        { 
          q: "What audio formats are supported?", 
          a: "We support MP3, WAV, FLAC, and AAC formats up to 50MB per file. For best quality, we recommend uploading in WAV or FLAC." 
        },
        { 
          q: "How do I edit my artist info?", 
          a: "Visit your Artist Dashboard and click the 'Artist Info' tab. Here you can update your bio, genres, social links, and upload an artist photo." 
        },
        { 
          q: "How many songs can I upload?", 
          a: "Free accounts can upload 2 songs per month. Artist accounts can upload up to 10 songs per month. Upload credits reset on the 1st of each month." 
        },
        { 
          q: "Can I edit my track after uploading?", 
          a: "You can edit the title, description, and other metadata, but not the audio file itself. Make sure your audio is perfect before uploading!" 
        }
      ]
    },
    {
      category: "Charts & Rankings",
      icon: TrendingUp,
      questions: [
        { 
          q: "How do songs get on the charts?", 
          a: "Songs need a minimum number of ratings to appear on charts. Rankings are based on community ratings, engagement, and recent activity." 
        },
        { 
          q: "How many times can I vote?", 
          a: "You can rate each track once with a rating from 1-5 stars. You can change your rating anytime by visiting the song's page." 
        },
        { 
          q: "When do charts update?", 
          a: "Charts update in real-time as new ratings and engagement come in. You'll see the most current rankings every time you visit." 
        },
        { 
          q: "Why isn't my song on the charts?", 
          a: "Songs need a minimum number of ratings before appearing on the main charts. Share your music with friends and fans to start getting votes!" 
        }
      ]
    },
    {
      category: "Account & Settings",
      icon: User,
      questions: [
        { 
          q: "How do I manage my notifications?", 
          a: "Go to Communication Preferences in your profile menu to control what notifications you receive and how often." 
        },
        { 
          q: "How do I cancel my subscription?", 
          a: "Visit your Billing Info page and click 'Cancel Subscription'. You can reactivate anytime before your current period ends." 
        },
        { 
          q: "What payment methods do you accept?", 
          a: "We accept all major credit cards and PayPal. You can update your payment method in your Billing Info page." 
        },
        { 
          q: "Can I get a refund?", 
          a: "We offer prorated refunds for unused subscription time. Contact support for assistance with refund requests." 
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 mb-8">Find answers to common questions about using DripCharts</p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search for help..." className="pl-10" />
          </div>
        </div>

        <div className="space-y-8">
          {faqs.map((category) => (
            <Card key={category.category} className="material-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-primary" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.questions.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                    <p className="text-gray-600">{item.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="material-shadow mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-6">Our support team is here to help you with any questions about using DripCharts.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@dripcharts.com" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Contact Support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}