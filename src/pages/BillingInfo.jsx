import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, History, CheckCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Placeholder for PayPal logo
const PayPalLogo = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <title>PayPal</title>
    <path d="M7.064 16.146c.26.04.433.15.51.362.06.16.08.35.03.543-.09.382-.36.56-.73.56H5.21c-.49 0-.82-.2-1.01-.58-.1-.2-.11-.42-.04-.64.08-.23.27-.4.54-.47.23-.05.48-.02.7.02.22.04.43.08.62.13l.03.01zm5.19-5.934c.14-.14.22-.33.25-.52.03-.2-.02-.4-.1-.57-.14-.3-.4-.44-.75-.44h-2.1c-.24 0-.47.04-.67.13-.19.08-.34.2-.42.34-.08.14-.12.3-.12.44 0 .19.04.38.12.56.08.17.2.3.36.38l.02.01h.01c.14.07.3.1.47.1h.49c.14 0 .28-.02.4-.06.12-.04.23-.1.32-.18l.01-.01c.05-.05.1-.1.14-.15zm-2.45-2.01h2.1c.46 0 .82.16 1.05.47.23.3.33.68.29 1.05-.04.36-.2.66-.46.88-.26.22-.6.33-1.01.33h-2.1c-.24 0-.47-.04-.68-.13s-.36-.21-.45-.35c-.09-.14-.13-.29-.12-.44s.04-.32.12-.46c.08-.14.22-.25.4-.33h.01c.16-.07.34-.1.52-.1zM11.75 6H8.72c-.52 0-.95.21-1.28.62-.33.42-.46.95-.36 1.49.04.22.1.42.19.6.09.18.2.33.34.45l.02.02c.4.34.88.52 1.42.52h.53c.18 0 .35-.02.51-.05.16-.03.32-.08.45-.14l.02-.01c.18-.08.34-.18.47-.3.13-.12.23-.26.29-.4.02-.06.05-.12.06-.18.06-.17.08-.34.07-.51-.03-.52-.27-1.02-.7-1.47zm6.33 6.31c-.13.3-.35.48-.65.55-.26.06-.52.05-.77-.02-.32-.09-.59-.26-.78-.5-.14-.18-.2-.38-.19-.58.01-.2.08-.39.21-.55.13-.16.3-.28.5-.35.2-.07.4-.1.59-.09.19.01.38.05.55.13.17.08.32.19.43.33l.01.01c.08.1.13.2.16.3.03.1.05.2.04.29zm-8.62 3.61c-.16.24-.42.36-.75.36h-1.4c-.54 0-.9-.23-1.07-.68-.1-.26-.11-.53-.02-.8.09-.27.3-.47.6-.58.3-.12.63-.13.94-.04.31.09.6.26.85.5zm10.37-3.92c-.32.69-.87 1.03-1.64 1.03-.6 0-1.1-.17-1.48-.51-.38-.34-.58-.8-.58-1.37s.23-1.02.69-1.35c.46-.33 1.05-.5 1.77-.5.25 0 .5.03.74.08.24.06.46.14.65.25.19.12.35.26.47.43.12.17.18.35.18.54.01.18-.04.36-.12.53a.92.92 0 0 1-.53.45zM21.51 9.7c.5-1.55-.42-2.8-1.7-3.15-1.28-.35-2.61.2-3.1 1.75-.49 1.55.42 2.8 1.7 3.15 1.28.35 2.61-.2 3.1-1.75zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0070ba"/>
    <path d="M10.33 13.43c-.14.18-.2.38-.19.58.01.2.08.39.21.55.13.16.3.28.5.35.2.07.4.1.59-.09.19.01.38.05.55.13.17.08.32.19.43.33l.01.01c.08.1.13.2.16.3.03.1.05.2.04.29-.02.26-.14.49-.33.67-.2.18-.45.27-.72.27-.22 0-.44-.04-.65-.12-.21-.08-.4-.2-.56-.35-.16-.16-.28-.35-.37-.55-.08-.2-.11-.4-.1-.61l.01-.03c.09-.43.43-1.02 1-1.34zm6.75-6.2c-1.28-.35-2.61.2-3.1 1.75-.49 1.55.42 2.8 1.7 3.15 1.28.35 2.61-.2 3.1-1.75.5-1.55-.42-2.8-1.7-3.15zm-2.12 4.11c-.46-.33-1.05-.5-1.77-.5-.25 0-.5.03-.74.08-.24.06-.46.14-.65.25-.19.12-.35.26-.47.43-.12.17-.18.35-.18.54.01.18-.04.36-.12.53a.92.92 0 0 1-.53.45c-.13.3-.35.48-.65.55-.26.06-.52.05-.77-.02-.32-.09-.59-.26-.78-.5a1.2 1.2 0 0 1-.16-1.58c.17-.08.32-.19.43-.33l.01.01c.08-.1.13-.2.16-.3.03-.1.05-.2.04-.29-.02-.26-.14-.49-.33-.67-.2-.18-.45-.27-.72-.27-.22 0-.44-.04-.65-.12-.21-.08-.4-.2-.56-.35-.16-.16-.28-.35-.37-.55-.08-.2-.11-.4-.1-.61l.01-.03c.09-.43.43-1.02 1-1.34.14-.14.22-.33.25-.52.03-.2-.02-.4-.1-.57-.14-.3-.4-.44-.75-.44h-2.1c-.24 0-.47.04-.67.13-.19.08-.34.2-.42.34-.08.14-.12.3-.12.44 0 .19.04.38.12.56.08.17.2.3.36.38l.02.01h.01c.14.07.3.1.47.1h.49c.14 0 .28-.02.4-.06.12-.04.23-.1.32-.18l.01-.01c.05-.05.1-.1.14-.15.4-.34.88-.52 1.42-.52h.53c.18 0 .35-.02.51-.05.16-.03.32-.08.45-.14l.02-.01c.18-.08.34-.18.47-.3.13-.12.23-.26.29-.4.02-.06.05-.12.06-.18.06-.17.08-.34.07-.51-.03-.52-.27-1.02-.7-1.47.33-.41.76-.62 1.28-.62h3.03c.46 0 .82.16 1.05.47.23.3.33.68.29 1.05-.04.36-.2.66-.46.88-.26.22-.6.33-1.01.33h-2.1c-.24 0-.47-.04-.68-.13s-.36-.21-.45-.35c-.09-.14-.13-.29-.12-.44s.04-.32.12-.46c.08-.14.22-.25.4-.33h.01c.16-.07.34-.1.52-.1h.21zm-6.73 8.35c.25-.24.54-.41.85-.5.31-.09.64-.08.94.04.3.11.51.31.6.58.09.27.08.54-.02.8-.17.45-.53.68-1.07.68h-1.4c-.33 0-.59-.12-.75-.36-.16-.24-.26-.52-.3-.82z" fill="#002f86"/>
  </svg>
);

export default function BillingInfoPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const planName = user?.profile?.plan_type ? user.profile.plan_type.charAt(0).toUpperCase() + user.profile.plan_type.slice(1) : 'Free';
  const hasPaymentMethod = user?.profile?.card_last4;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-8 px-4 max-w-4xl"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Billing</h1>
        <p className="text-lg text-gray-600">Manage your subscription and payment details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900">{planName}</p>
              <p className="text-gray-500 mt-2">Your plan renews on January 1, 2026.</p>
              <Link to={createPageUrl("Pricing")}>
                <Button className="w-full mt-6 bg-[#6A12CC] hover:bg-[#26054D] text-white">Upgrade Plan</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              {hasPaymentMethod ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-gray-500" />
                    <div>
                      <p className="font-semibold">Visa ending in {user.profile.card_last4}</p>
                      <p className="text-sm text-gray-500">Expires {user.profile.card_exp_month}/{user.profile.card_exp_year}</p>
                    </div>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              ) : (
                 <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <p className="text-gray-500">No credit card connected.</p>
                 </div>
              )}
               <div className="flex items-center justify-between p-4 border rounded-lg mt-4">
                  <div className="flex items-center gap-4">
                    <PayPalLogo />
                    <p className="font-semibold">PayPal</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Billing History</CardTitle>
            <CardDescription>View and download your past invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">December 2025 Invoice</p>
                  <p className="text-sm text-gray-500">Paid on Dec 1, 2025</p>
                </div>
                <Button variant="ghost">Download</Button>
              </div>
               <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">November 2025 Invoice</p>
                  <p className="text-sm text-gray-500">Paid on Nov 1, 2025</p>
                </div>
                <Button variant="ghost">Download</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-md mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Secure Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            All payments are securely processed by Stripe. We do not store your full credit card details on our servers.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}