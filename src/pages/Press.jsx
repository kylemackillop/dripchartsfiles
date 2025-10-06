import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Image } from "lucide-react";

export default function PressPage() {
  const pressReleases = [
    {
      date: "2024-01-15",
      title: "DripCharts Launches to Revolutionize Music Discovery",
      summary: "New platform connects independent artists directly with engaged music fans through community-driven charts."
    },
    {
      date: "2024-02-01",
      title: "DripCharts Reaches 10,000 Active Users in First Month",
      summary: "Platform sees rapid growth as artists and listeners embrace community-driven music discovery."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Press Center</h1>
          <p className="text-lg text-gray-600">Latest news, press releases, and media resources for DripCharts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="material-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary" />
                Media Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Press Inquiries</p>
                  <p className="text-gray-600">press@dripcharts.com</p>
                </div>
                <div>
                  <p className="font-semibold">Partnership Inquiries</p>
                  <p className="text-gray-600">partnerships@dripcharts.com</p>
                </div>
                <div>
                  <p className="font-semibold">General Media</p>
                  <p className="text-gray-600">media@dripcharts.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="material-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Image className="w-6 h-6 text-primary" />
                Brand Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Logo Pack
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Screenshots
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Download className="w-4 h-4" />
                Brand Guidelines
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="material-shadow mb-8">
          <CardHeader>
            <CardTitle>About DripCharts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              DripCharts is a community-driven music discovery platform that connects independent artists with engaged listeners. 
              Unlike traditional streaming services that rely on algorithmic recommendations, DripCharts empowers real music fans 
              to shape what others discover through authentic engagement and community-driven charts. The platform provides artists 
              with tools to build genuine audiences while giving listeners the power to become tastemakers in their favorite genres.
            </p>
          </CardContent>
        </Card>

        <Card className="material-shadow">
          <CardHeader>
            <CardTitle>Press Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{release.title}</h3>
                      <p className="text-gray-600 mb-2">{release.summary}</p>
                      <p className="text-sm text-gray-500">{new Date(release.date).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}