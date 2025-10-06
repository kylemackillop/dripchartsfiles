import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Users, Heart, TrendingUp, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useUser } from '@/components/contexts/UserContext';

const ValueCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
  >
    <Card className="material-shadow h-full">
      <CardContent className="p-8 text-center">
        <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function AboutPage() {
  const { login } = useUser();
  
  const values = [
    {
      icon: Users,
      title: "Community Over Algorithms",
      description: "Real music fans make better recommendations than any algorithm"
    },
    {
      icon: Music,
      title: "Artists Deserve Recognition", 
      description: "Talent should determine success, not marketing budgets"
    },
    {
      icon: Heart,
      title: "Discovery Should Be Rewarding",
      description: "Finding and sharing great music should benefit everyone involved"
    },
    {
      icon: TrendingUp,
      title: "Transparency Matters",
      description: "Artists and fans deserve to understand how music gets discovered"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
            .about-headings {
                color: #26054D !important;
            }
        `}
      </style>
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 about-headings">About DripCharts</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We built DripCharts because we believe music discovery should be driven by real people, not corporate algorithms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">The Problem We're Solving</h2>
                <div className="text-lg space-y-4 leading-relaxed">
                  <p>
                    Great music gets lost every day. Talented artists pour their hearts into creating amazing songs, only to watch them disappear into the noise of massive streaming platforms. Meanwhile, music lovers scroll endlessly through algorithmic recommendations, rarely discovering the underground gems that would become their new favorites.
                  </p>
                </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-8 about-headings">Our Mission</h2>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                To create a fair, community-driven platform where exceptional music rises to the top based on its quality, not marketing budgets or algorithmic bias. We're building a space where artists get discovered based on their talent and listeners find music that genuinely moves them.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12 about-headings">How We're Different</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <ValueCard key={index} {...value} delay={index * 0.1} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join The Movement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6 text-white">Join The Movement</h2>
              <p className="text-lg mb-8 leading-relaxed text-white">
                Whether you're an artist ready to share your music or a music lover looking for your next favorite song, DripCharts is your platform. Join thousands of users who are already discovering and celebrating authentic music.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-[#26054D] hover:bg-gray-100 font-semibold"
                  onClick={login}
                >
                  Share Your Music
                </Button>
                <Link to={createPageUrl("Charts")}>
                  <Button size="lg" className="bg-white text-[#26054D] hover:bg-gray-100 font-semibold">
                    Explore Charts
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4 about-headings">Get In Touch</h2>
            <p className="text-lg text-gray-600 mb-6">
              Have questions or want to get involved? We'd love to hear from you.
            </p>
            <a href="mailto:info@dripcharts.com">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contact Us
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}