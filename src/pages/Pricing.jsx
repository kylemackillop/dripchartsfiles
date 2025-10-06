
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Zap, Star, Rocket, Headphones } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const SubscriptionTier = ({ title, price, description, features, popular, buttonText, accentColor, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="relative h-full"
  >
    <Card className={`material-shadow h-full flex flex-col transition-all duration-300 hover:border-purple-300 hover:shadow-xl ${popular ? 'border-2 border-primary' : ''}`}>
      {popular && (
        <div className={`absolute -top-3 right-5 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
          Most Popular
        </div>
      )}
      <CardHeader className="pt-8 text-center">
        <div className="flex justify-center items-center gap-3">
            <Icon className={`w-8 h-8 ${accentColor}`} />
            <CardTitle className={`text-2xl font-bold ${accentColor}`}>
              {title}
            </CardTitle>
        </div>
        <div className="text-4xl font-extrabold text-gray-900 mt-4">
          {price}
          {price !== "Free" && <span className="text-lg font-medium text-gray-500">/month</span>}
        </div>
        <CardDescription className="text-gray-500 h-10 mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow px-8">
        <ul className="space-y-3 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="px-8 pb-8">
        <Button 
          size="lg" 
          className={`w-full text-lg py-6 text-white transition-colors ${
            popular 
              ? 'bg-purple-400 hover:bg-primary' 
              : 'bg-purple-400 hover:bg-primary'
          }`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const CreditPackage = ({ uploads, price, perUpload, discount }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
    >
        <Card className="material-shadow group-hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{uploads} Uploads</h3>
                    <p className="text-sm text-gray-500">${perUpload}/upload {discount && <span className="text-green-600 font-medium">({discount} off)</span>}</p>
                </div>
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    ${price}
                </Button>
            </CardContent>
        </Card>
    </motion.div>
);

export default function PricingPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <div className="inline-block bg-purple-100 text-primary rounded-full px-4 py-1 mb-4 font-semibold">
                Flexible Pricing
            </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Find the Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're an artist, a label, or a passionate listener.
          </p>
        </div>

        <Tabs defaultValue="subscriptions" className="space-y-10">
          <TabsList className="bg-gray-200 p-1 rounded-xl grid grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary text-gray-600 px-4 py-2 rounded-lg transition-all duration-200">
              <Star className="w-4 h-4 mr-2"/> Subscriptions
            </TabsTrigger>
            <TabsTrigger value="credits" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary text-gray-600 px-4 py-2 rounded-lg transition-all duration-200">
              <Rocket className="w-4 h-4 mr-2"/> Upload Credits
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscriptions">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <SubscriptionTier
                icon={Star}
                title="Free"
                price="Free"
                description="Try DripCharts for free."
                features={[
                  "1 hour listening per day",
                  "Rank up to 10 songs",
                  "Upload 2 songs per month",
                  "Basic community features",
                ]}
                buttonText="Get Started"
                accentColor="text-gray-600"
              />
              <SubscriptionTier
                icon={Headphones}
                title="Listener"
                price="$3.99"
                description="For the passionate music fan."
                features={[
                    "Unlimited ad-free listening",
                    "Unlimited song ranking",
                    "Create up to 10 playlists",
                    "Follow favorite artists",
                    "Exclusive community access"
                ]}
                buttonText="Start Listening"
                accentColor="text-blue-500"
              />
              <SubscriptionTier
                icon={Zap}
                title="Artist"
                price="$4.99"
                description="For the serious artist."
                features={[
                  "Unlimited ad-free listening",
                  "Upload up to 10 songs per month",
                  "Advanced analytics dashboard",
                  "Community engagement tools",
                  "Track performance insights",
                  "Priority support",
                ]}
                popular
                buttonText="Start Creating"
                accentColor="text-primary"
              />
            </div>
            
            <div className="text-center mt-8 text-gray-600">
              <p>Cancel anytime. No long-term commitments.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="credits">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Pay-As-You-Go Credits</h2>
                    <p className="text-lg text-gray-600">Perfect for artists who upload occasionally. Credits never expire.</p>
                </div>
                <div className="space-y-4">
                    <CreditPackage uploads={1} price="2.99" perUpload="2.99" />
                    <CreditPackage uploads={5} price="12.99" perUpload="2.60" discount="13%" />
                    <CreditPackage uploads={10} price="22.99" perUpload="2.30" discount="23%" />
                    <CreditPackage uploads={20} price="39.99" perUpload="2.00" discount="33%" />
                </div>
                 <Card className="material-shadow text-center">
                    <CardHeader className="pt-8">
                        <CardTitle className="text-2xl text-gray-800">Enterprise Solutions</CardTitle>
                        <CardDescription className="text-gray-500">Custom packages for labels, distributors, and institutions.</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                         <p className="text-gray-600">Bulk uploads, custom API access, dedicated support, and more.</p>
                        <Button className="mt-4" variant="secondary">Contact Sales</Button>
                    </CardContent>
                </Card>
              </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
