import React, { useState, useEffect } from "react";
import { User, Banner, Notification } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Bell, Megaphone, Users, Plus, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    title: "",
    message: "",
    type: "info",
    start_date: "",
    end_date: "",
    priority: 1
  });

  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    message: "",
    link_url: "",
    type: "system_update",
    target_segment: "all"
  });

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        throw new Error('Not authorized');
      }
      setUser(userData);
      
      const [allBanners, allUsers] = await Promise.all([
        Banner.list('-priority'),
        User.list('-created_date')
      ]);
      
      setBanners(allBanners);
      setUsers(allUsers);
    } catch (error) {
      console.error("Access denied or error loading data:", error);
      // Redirect non-admin users
      window.location.href = '/';
    }
    setIsLoading(false);
  };

  const handleCreateBanner = async () => {
    if (!bannerForm.title || !bannerForm.message) {
      alert("Title and message are required");
      return;
    }

    try {
      await Banner.create(bannerForm);
      setBannerForm({
        title: "",
        message: "",
        type: "info",
        start_date: "",
        end_date: "",
        priority: 1
      });
      
      // Reload banners
      const allBanners = await Banner.list('-priority');
      setBanners(allBanners);
      
      alert("Banner created successfully!");
    } catch (error) {
      console.error("Error creating banner:", error);
      alert("Error creating banner");
    }
  };

  const handleSendNotifications = async () => {
    if (!notificationForm.message || !notificationForm.link_url) {
      alert("Message and link URL are required");
      return;
    }

    try {
      let targetUsers = [];
      
      if (notificationForm.target_segment === "all") {
        targetUsers = users;
      } else {
        targetUsers = users.filter(u => 
          u.profile?.plan_type === notificationForm.target_segment
        );
      }

      // Create notifications for all target users
      const notifications = targetUsers.map(u => ({
        user_email: u.email,
        message: notificationForm.message,
        link_url: notificationForm.link_url,
        type: notificationForm.type
      }));

      await Notification.bulkCreate(notifications);
      
      setNotificationForm({
        message: "",
        link_url: "",
        type: "system_update",
        target_segment: "all"
      });
      
      alert(`Sent ${notifications.length} notifications successfully!`);
    } catch (error) {
      console.error("Error sending notifications:", error);
      alert("Error sending notifications");
    }
  };

  const getSegmentStats = () => {
    const stats = {
      all: users.length,
      free: users.filter(u => !u.profile?.plan_type || u.profile?.plan_type === 'free').length,
      listener: users.filter(u => u.profile?.plan_type === 'listener').length,
      artist: users.filter(u => u.profile?.plan_type === 'artist').length,
      professional: users.filter(u => u.profile?.plan_type === 'professional').length
    };
    return stats;
  };

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

  const segmentStats = getSegmentStats();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">Manage banners, notifications, and user segments.</p>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="banners">
            <Megaphone className="w-4 h-4 mr-2" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="material-shadow">
              <CardHeader>
                <CardTitle>Create New Banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm(prev => ({...prev, title: e.target.value}))}
                    placeholder="Scheduled Maintenance"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={bannerForm.message}
                    onChange={(e) => setBannerForm(prev => ({...prev, message: e.target.value}))}
                    placeholder="We'll be performing maintenance on..."
                    className="h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={bannerForm.type} onValueChange={(value) => setBannerForm(prev => ({...prev, type: value}))}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Input
                      type="number"
                      value={bannerForm.priority}
                      onChange={(e) => setBannerForm(prev => ({...prev, priority: parseInt(e.target.value) || 1}))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={bannerForm.start_date}
                      onChange={(e) => setBannerForm(prev => ({...prev, start_date: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={bannerForm.end_date}
                      onChange={(e) => setBannerForm(prev => ({...prev, end_date: e.target.value}))}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateBanner} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Banner
                </Button>
              </CardContent>
            </Card>

            <Card className="material-shadow">
              <CardHeader>
                <CardTitle>Active Banners</CardTitle>
              </CardHeader>
              <CardContent>
                {banners.length > 0 ? (
                  <div className="space-y-3">
                    {banners.map((banner) => (
                      <div key={banner.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{banner.title}</h4>
                            <p className="text-sm text-gray-600">{banner.message}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant={banner.is_active ? "default" : "secondary"}>
                                {banner.is_active ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="outline">{banner.type}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No banners created yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="material-shadow">
              <CardHeader>
                <CardTitle>Send Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Segment</Label>
                  <Select value={notificationForm.target_segment} onValueChange={(value) => setNotificationForm(prev => ({...prev, target_segment: value}))}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users ({segmentStats.all})</SelectItem>
                      <SelectItem value="free">Free Users ({segmentStats.free})</SelectItem>
                      <SelectItem value="listener">Listener Plan ({segmentStats.listener})</SelectItem>
                      <SelectItem value="artist">Artist Plan ({segmentStats.artist})</SelectItem>
                      <SelectItem value="professional">Professional Plan ({segmentStats.professional})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <Select value={notificationForm.type} onValueChange={(value) => setNotificationForm(prev => ({...prev, type: value}))}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system_update">System Update</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="ranking_change">Ranking Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm(prev => ({...prev, message: e.target.value}))}
                    placeholder="Your notification message..."
                    className="h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input
                    value={notificationForm.link_url}
                    onChange={(e) => setNotificationForm(prev => ({...prev, link_url: e.target.value}))}
                    placeholder="/charts or https://..."
                  />
                </div>
                <Button onClick={handleSendNotifications} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send to {notificationForm.target_segment === "all" ? "All Users" : `${notificationForm.target_segment} Users`}
                </Button>
              </CardContent>
            </Card>

            <Card className="material-shadow">
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">All Users</span>
                    <Badge variant="outline">{segmentStats.all}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Free Plan</span>
                    <Badge variant="outline">{segmentStats.free}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Listener Plan</span>
                    <Badge variant="outline">{segmentStats.listener}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Artist Plan</span>
                    <Badge variant="outline">{segmentStats.artist}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Professional Plan</span>
                    <Badge variant="outline">{segmentStats.professional}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}