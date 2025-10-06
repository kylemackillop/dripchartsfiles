import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/api/entities";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await User.loginWithEmail(email, password);
      onClose();
    } catch (error) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await User.signUpWithEmail(email, password);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to create account. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    User.login();
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-white rounded-2xl shadow-2xl border-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="p-8"
        >
          {/* DripCharts Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#26054D] rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68a38fd203bea9861c466cec/4990d07f3_f98418746_dripchartscopy.png" 
                alt="DripCharts Logo" 
                className="w-10 h-10"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DripCharts</h2>
            <p className="text-gray-600">
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors mb-6 flex items-center justify-center gap-3"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-200 w-full"></div>
            <div className="bg-white px-4 text-sm text-gray-500 absolute">OR</div>
          </div>
          
          <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn}>
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-12 border-gray-300"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="h-12 border-gray-300"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#26054D] hover:bg-[#6A12CC] text-white mb-6"
            >
              {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between items-center text-sm">
            {!isSignUp ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <p className="text-primary hover:underline cursor-pointer">
                    Forgot password?
                  </p>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Password Reset</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be redirected to the standard login page to securely reset your password. Would you like to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => User.login()}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div />
            )}

            <p className="text-gray-600">
              {isSignUp ? "Already have an account?" : "Need an account?"}
              <span
                onClick={toggleMode}
                className="ml-1 text-primary hover:underline cursor-pointer font-medium"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}