
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UserData, User as AuthUser } from "@/api/entities";

import { TrendingUp, Headphones, User, Zap, LogIn, Shield, UserCircle, Bell, DollarSign, BellRing, Info, Menu, X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/utils/ScrollToTop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProvider, useUser } from '@/components/contexts/UserContext';
import { NotificationProvider, useNotifications } from '@/components/contexts/NotificationContext';
import { MusicPlayerProvider } from '@/components/contexts/MusicPlayerContext';
import { GuestSessionProvider } from '@/components/contexts/GuestSessionContext';
import MiniPlayer from '@/components/music/MiniPlayer';
import ConversionModal from '@/components/conversion/ConversionModal';
import LoginModal from '@/components/auth/LoginModal';

const navigationItems = [
  { name: "About", href: createPageUrl("About") },
  { name: "Charts", href: createPageUrl("Charts") },
  { name: "Discover", href: createPageUrl("Discover") },
  // { name: "Pricing", href: createPageUrl("Pricing") }, // Feature flag: disabled for now
];

function LayoutContent({ children, currentPageName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isInitialized } = useUser();
  const { notifications } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const newFaviconUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68a38fd203bea9861c466cec/4990d07f3_f98418746_dripchartscopy.png";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = newFaviconUrl;
  }, []);

  useEffect(() => {
    const loadUserProfileImage = async () => {
      if (user && isInitialized) {
        try {
          const userDataRecords = await UserData.filter({ user_email: user.email });
          if (userDataRecords.length > 0 && userDataRecords[0].profile_image_url) {
            setUserProfileImage(userDataRecords[0].profile_image_url);
          } else {
            setUserProfileImage(null);
          }
        } catch (error) {
          console.error("Error loading user profile image:", error);
          setUserProfileImage(null);
        }
      } else {
        setUserProfileImage(null);
      }
    };
    loadUserProfileImage();
  }, [user, isInitialized]);

  const isActive = (href) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    await logout();
    navigate(createPageUrl("Charts"));
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const isRegisteredUser = user && (user.role === 'admin' || user.profile?.plan_type);

  return (
    <MusicPlayerProvider>
      <div className="max-w-[1280px] mx-auto">
        <ScrollToTop />
        <style>
          {`
            .material-shadow {
              box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
              transition: all 0.3s cubic-bezier(.25,.8,.25,1);
            }
            .material-shadow:hover {
              box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
            }
            .about-headings {
              font-family: 'Poppins', sans-serif;
            }
            .plus-icon-hover:hover {
              font-weight: bold !important;
              color: #26054D !important;
            }
          `}
        </style>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link to={createPageUrl("Charts")} className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68a38fd203bea9861c466cec/4990d07f3_f98418746_dripchartscopy.png" alt="DripCharts Logo" className="h-8 w-8" />
                    <span>DripCharts</span>
                  </Link>
                  <nav className="hidden md:flex gap-6">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`text-sm font-medium transition-colors ${
                          isActive(item.href) ? "text-primary" : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  {isAuthenticated ? (
                     <div className="flex items-center gap-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                              <Bell className="h-5 w-5" />
                              {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                  {notifications.length}
                                </span>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.length > 0 ? (
                              notifications.map((n) => (
                                <DropdownMenuItem key={n.id}>{n.message}</DropdownMenuItem>
                              ))
                            ) : (
                              <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>

                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center gap-2 h-10 px-3">
                             {userProfileImage ? (
                               <img
                                 src={userProfileImage}
                                 alt={user?.full_name || user?.email || "User Profile"}
                                 className="w-7 h-7 rounded-full object-cover"
                               />
                             ) : (
                               <div className="w-7 h-7 bg-[#6A12CC] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                 {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                               </div>
                             )}
                             <span className="hidden md:inline text-sm font-medium">{user?.full_name || "Profile"}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>{user?.full_name}</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => navigate(createPageUrl("AccountSettings"))}>
                             <UserCircle className="mr-2 h-4 w-4" />
                             <span>Account</span>
                           </DropdownMenuItem>
                           {isRegisteredUser && (
                             <>
                               <DropdownMenuItem onClick={() => navigate(createPageUrl("ArtistProfile"))}>
                                 <Music className="mr-2 h-4 w-4" />
                                 <span>Artist Info</span>
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => navigate(createPageUrl("ListenerInfo"))}>
                                 <Headphones className="mr-2 h-4 w-4" />
                                 <span>Listener Info</span>
                               </DropdownMenuItem>
                             </>
                           )}
                           <DropdownMenuItem onClick={() => navigate(createPageUrl("SecuritySettings"))}>
                             <Shield className="mr-2 h-4 w-4" />
                             <span>Security</span>
                           </DropdownMenuItem>
                           {/* Feature flag: Billing disabled for now
                           <DropdownMenuItem onClick={() => navigate(createPageUrl("BillingInfo"))}>
                            <DollarSign className="mr-2 h-4 w-4"/>
                            <span>Billing</span>
                           </DropdownMenuItem>
                           */}
                           <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={handleLogout}>
                             <LogIn className="mr-2 h-4 w-4" />
                             <span>Logout</span>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                       </DropdownMenu>
                     </div>
                  ) : (
                    <div className="hidden md:flex items-center gap-2">
                      <Button variant="ghost" onClick={handleLogin}>Login</Button>
                      <Button onClick={handleLogin}>Sign Up Free</Button>
                    </div>
                  )}

                  <div className="md:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      {mobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
             {mobileMenuOpen && (
              <div className="md:hidden bg-white border-t">
                <nav className="container mx-auto px-4 py-4 space-y-2">
                   {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                           onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors ${
                            isActive(item.href) ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {item.name}
                        </Link>
                    ))}
                    {!isAuthenticated && (
                       <div className="border-t pt-4 space-y-2">
                         <Button variant="outline" className="w-full" onClick={handleLogin}>Login</Button>
                         <Button className="w-full" onClick={handleLogin}>Sign Up Free</Button>
                       </div>
                    )}
                </nav>
              </div>
            )}
          </header>

          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <MiniPlayer />
          <ConversionModal />
          <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
      </div>
    </MusicPlayerProvider>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <UserProvider>
      <GuestSessionProvider>
        <NotificationProvider>
          <LayoutContent children={children} currentPageName={currentPageName} />
        </NotificationProvider>
      </GuestSessionProvider>
    </UserProvider>
  );
}
