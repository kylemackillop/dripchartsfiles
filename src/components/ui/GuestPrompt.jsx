import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, UserPlus } from 'lucide-react';
import { User } from '@/api/entities';
import { useGuestSession } from '../contexts/GuestSessionContext';

export default function GuestPrompt({ action, children, className = "" }) {
  const { triggerConversion } = useGuestSession();

  const handleSignUp = () => {
    triggerConversion(action);
  };

  return (
    <Card className={`border-purple-200 bg-purple-50 ${className}`}>
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <LogIn className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-900">Sign up required</span>
        </div>
        {children && (
          <p className="text-sm text-purple-700 mb-3 text-center">{children}</p>
        )}
        <div className="flex gap-2 justify-center">
          <Button size="sm" onClick={handleSignUp} className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="w-4 h-4 mr-1" />
            Join Free
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}