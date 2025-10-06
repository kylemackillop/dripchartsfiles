import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Shield, BarChart3, Target } from "lucide-react";

export default function CookieSettingsPage() {
  const [settings, setSettings] = useState({
    essential: true, // Always true, can't be disabled
    analytics: true,
    functional: true,
    advertising: false
  });

  const handleToggle = (key) => {
    if (key === 'essential') return; // Can't disable essential cookies
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // In a real app, this would save to user preferences and update cookie consent
    alert("Cookie preferences saved!");
  };

  const cookieCategories = [
    {
      key: 'essential',
      title: 'Essential Cookies',
      description: 'Required for basic website functionality, user authentication, and security.',
      icon: Shield,
      examples: 'Login status, security tokens, form submissions',
      required: true
    },
    {
      key: 'functional',
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization like remembering your preferences.',
      icon: Cookie,
      examples: 'Language preferences, volume settings, theme choices'
    },
    {
      key: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how you use DripCharts to improve our service.',
      icon: BarChart3,
      examples: 'Google Analytics, page views, user interactions'
    },
    {
      key: 'advertising',
      title: 'Advertising Cookies',
      description: 'Used to show you relevant advertisements and measure ad performance.',
      icon: Target,
      examples: 'Ad personalization, conversion tracking, retargeting'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Cookie className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Cookie Settings</h1>
          <p className="text-lg text-gray-600">Manage your cookie preferences for DripCharts</p>
        </div>

        <div className="space-y-6">
          <Card className="material-shadow">
            <CardHeader>
              <CardTitle>About Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                DripCharts uses cookies to provide you with the best possible experience. Cookies are small text files stored on your device that help us remember your preferences, keep you logged in, and understand how you use our platform. You can control which cookies we use below.
              </p>
            </CardContent>
          </Card>

          {cookieCategories.map((category) => (
            <Card key={category.key} className="material-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <category.icon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
                        {category.required && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Required</span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{category.description}</p>
                      <p className="text-sm text-gray-500">
                        <strong>Examples:</strong> {category.examples}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Label htmlFor={category.key} className="sr-only">{category.title}</Label>
                    <Switch
                      id={category.key}
                      checked={settings[category.key]}
                      onCheckedChange={() => handleToggle(category.key)}
                      disabled={category.required}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center gap-4 pt-6">
            <Button variant="outline" onClick={() => setSettings({ essential: true, analytics: false, functional: false, advertising: false })}>
              Accept Only Essential
            </Button>
            <Button onClick={() => setSettings({ essential: true, analytics: true, functional: true, advertising: true })}>
              Accept All
            </Button>
            <Button onClick={handleSave} variant="secondary">
              Save Preferences
            </Button>
          </div>
        </div>

        <Card className="material-shadow mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Need More Information?</h3>
            <p className="text-gray-600 mb-4">
              For detailed information about how we use cookies and protect your privacy, please read our Privacy Policy.
            </p>
            <div className="text-sm text-gray-500">
              <p><strong>Questions?</strong> Contact us at privacy@dripcharts.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}