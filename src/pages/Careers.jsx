import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Zap } from "lucide-react";

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Help build the future of music discovery with React, TypeScript, and modern web technologies."
    },
    {
      title: "Music Industry Partnerships Manager",
      department: "Business Development",
      location: "New York, NY",
      type: "Full-time",
      description: "Build relationships with independent artists, labels, and industry professionals."
    },
    {
      title: "Community Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Foster and grow our community of artists and music lovers across social platforms."
    }
  ];

  const benefits = [
    "Competitive salary and equity",
    "Comprehensive health, dental, and vision insurance",
    "Flexible work arrangements",
    "Professional development budget",
    "Music festival and concert budget",
    "Unlimited PTO policy"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Team</h1>
          <p className="text-lg text-gray-600">Help us revolutionize how people discover music</p>
        </div>

        <Card className="material-shadow mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Why Work at DripCharts?</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">
              Join a passionate team building the future of music discovery. We're creating a platform where great music finds its audience, 
              and we need talented people who share our vision of empowering independent artists and music lovers.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Our Values
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Music-first mindset</li>
                  <li>• Community over algorithms</li>
                  <li>• Transparent communication</li>
                  <li>• Continuous learning</li>
                  <li>• Work-life balance</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Benefits
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Open Positions</h2>
          <div className="space-y-6">
            {openings.map((job, index) => (
              <Card key={index} className="material-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-gray-600">{job.description}</p>
                    </div>
                    <Button className="ml-4">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="material-shadow">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Don't See Your Role?</h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented people who are passionate about music and technology. 
              Send us your resume and tell us how you'd like to contribute to DripCharts.
            </p>
            <Button>Send Us Your Resume</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}