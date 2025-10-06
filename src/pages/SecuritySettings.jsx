
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, Smartphone, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function SecuritySettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Security Settings</h1>
        <p className="text-lg text-gray-600">Manage your account security and privacy</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Password & Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-600">
              Your account is secured through Google OAuth. Password management is handled by Google.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-600">
              Two-factor authentication is managed through your Google account settings.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-600">
              Learn about how your data is used and managed in our Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
