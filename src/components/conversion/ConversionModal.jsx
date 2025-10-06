import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/api/entities";
import { useGuestSession } from '../contexts/GuestSessionContext';
import { motion } from "framer-motion";
import { Star, Headphones, List, Play, Clock, Timer } from 'lucide-react';

export default function ConversionModal() {
  const { showConversionModal, conversionTrigger, closeConversionModal, getRemainingPlays } = useGuestSession();

  const getConversionContent = () => {
    switch (conversionTrigger) {
      case 'play_limit':
        return {
          icon: <Play className="w-12 h-12 text-[#6A12CC]" />,
          title: 'Play Limit Reached',
          description: `You've reached your limit of ${5 - getRemainingPlays()} free plays. Join DripCharts to get unlimited music streaming!`,
          features: ['Unlimited song plays', 'Rate and discover music', 'Create playlists', 'Support independent artists']
        };
      case 'playlist':
        return {
          icon: <List className="w-12 h-12 text-[#6A12CC]" />,
          title: 'Create Playlists',
          description: 'Join DripCharts to create and share your own playlists with the community.',
          features: ['Create unlimited playlists', 'Share with friends', 'Discover curated music', 'Rate songs and albums']
        };
      case 'rating':
        return {
          icon: <Star className="w-12 h-12 text-[#6A12CC]" />,
          title: 'Rate Songs',
          description: 'Help shape the charts by rating songs and discovering new music.',
          features: ['Rate unlimited songs', 'Influence the charts', 'Get personalized recommendations', 'Support emerging artists']
        };
      case 'browsing_time':
        return {
          icon: <Timer className="w-12 h-12 text-[#6A12CC]" />,
          title: 'Loving DripCharts?',
          description: 'You\'ve been exploring for a while! Join our community to unlock the full experience.',
          features: ['Unlimited browsing time', 'Save your favorite tracks', 'Create custom playlists', 'Connect with artists']
        };
      default:
        return {
          icon: <Headphones className="w-12 h-12 text-[#6A12CC]" />,
          title: 'Join DripCharts',
          description: 'Unlock the full music discovery experience.',
          features: ['Unlimited music streaming', 'Create playlists', 'Rate and review', 'Discover new artists']
        };
    }
  };

  const handleSignUp = () => {
    User.login();
    closeConversionModal();
  };

  if (!showConversionModal) return null;

  const content = getConversionContent();

  return (
    <Dialog open={showConversionModal} onOpenChange={closeConversionModal}>
      <DialogContent className="sm:max-w-md p-0 bg-white rounded-2xl shadow-2xl border-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="p-8"
        >
          {/* DripCharts Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#26054D] rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68a38fd203bea9861c466cec/4990d07f3_f98418746_dripchartscopy.png" 
                alt="DripCharts Logo" 
                className="w-10 h-10"
              />
            </div>
          </div>

          {/* Content Icon */}
          <div className="flex justify-center mb-4">
            {content.icon}
          </div>

          {/* Title and Description */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
            <p className="text-gray-600">{content.description}</p>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-8">
            {content.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#6A12CC] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Sign Up Buttons */}
          <div className="space-y-3 mb-4">
            {/* Google Sign In Button */}
            <Button
              onClick={handleSignUp}
              className="w-full h-12 bg-[#6A12CC] hover:bg-[#26054D] text-white flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            {/* Email Sign Up Button */}
            <Button
              onClick={handleSignUp}
              variant="outline"
              className="w-full h-12 border-[#6A12CC] text-[#6A12CC] hover:bg-[#6A12CC] hover:text-white"
            >
              Sign Up with Email
            </Button>
          </div>

          {/* Continue as Guest */}
          <Button
            onClick={closeConversionModal}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-800"
          >
            Continue as Guest
          </Button>

          {/* Footer Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Free to join • No credit card required
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}