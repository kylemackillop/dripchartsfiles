import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Save, Bell, Mail } from 'lucide-react';

const preferenceOptions = [
    { value: 'instant', label: 'Instantly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'off', label: 'Off' }
];

const artistNotificationCategories = [
    { id: 'song_likes', label: 'Song Likes', description: 'When someone likes one of your tracks.' },
    { id: 'playlist_adds', label: 'Playlist Adds', description: 'When your track is added to a playlist.' }
];

const listenerNotificationCategories = [
    { id: 'playlist_likes', label: 'Playlist Likes', description: 'When someone likes one of your playlists.' },
    { id: 'playlist_shares', label: 'Playlist Shares', description: 'When someone shares one of your playlists.' }
];

export default function CommunicationPreferencesPage() {
    const [user, setUser] = useState(null);
    const [preferences, setPreferences] = useState({
        song_likes: 'daily',
        playlist_adds: 'daily',
        playlist_likes: 'daily',
        playlist_shares: 'daily'
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await User.me();
                setUser(userData);
                if (userData.profile?.communication_preferences) {
                    setPreferences(prev => ({ ...prev, ...userData.profile.communication_preferences }));
                }
            } catch (e) {
                console.error("Failed to load user");
            }
        };
        loadUser();
    }, []);

    const handlePrefChange = (category, value) => {
        setPreferences(prev => ({ ...prev, [category]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await User.updateMyUserData({ 
                profile: { 
                    ...user.profile,
                    communication_preferences: preferences 
                } 
            });
            alert('Preferences saved!');
        } catch (error) {
            console.error('Failed to save preferences:', error);
            alert('Could not save preferences.');
        } finally {
            setIsSaving(false);
        }
    };

    const planType = user?.profile?.plan_type || 'free';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto py-8 px-4 max-w-4xl"
        >
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Communication Preferences</h1>
                <p className="text-lg text-gray-600">Choose what you want to be notified about and how.</p>
            </div>
            
            <Card className="material-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell /> In-App Notifications</CardTitle>
                    <CardDescription>Notifications delivered to the bell icon in the app.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {(planType === 'artist' || planType === 'professional') &&
                      artistNotificationCategories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label htmlFor={`select-${cat.id}`} className="font-semibold">{cat.label}</Label>
                                <p className="text-sm text-gray-500">{cat.description}</p>
                            </div>
                            <Select value={preferences[cat.id]} onValueChange={(value) => handlePrefChange(cat.id, value)}>
                                <SelectTrigger id={`select-${cat.id}`} className="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {preferenceOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                    {(planType === 'listener' || planType === 'free') &&
                      listenerNotificationCategories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label htmlFor={`select-${cat.id}`} className="font-semibold">{cat.label}</Label>
                                <p className="text-sm text-gray-500">{cat.description}</p>
                            </div>
                            <Select value={preferences[cat.id]} onValueChange={(value) => handlePrefChange(cat.id, value)}>
                                <SelectTrigger id={`select-${cat.id}`} className="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {preferenceOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </CardContent>
            </Card>

             <Card className="material-shadow mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Mail /> Email Notifications</CardTitle>
                    <CardDescription>Emails sent to your registered address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                       <div>
                           <Label className="font-semibold">Marketing & Promotions</Label>
                           <p className="text-sm text-gray-500">Receive news, offers, and platform updates.</p>
                       </div>
                       <Switch />
                   </div>
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                       <div>
                           <Label className="font-semibold">Activity Digest</Label>
                           <p className="text-sm text-gray-500">Get a weekly summary of your account activity.</p>
                       </div>
                       <Switch defaultChecked/>
                   </div>
                    <CardDescription>
                        Please note: You cannot opt out of essential communications regarding your account, such as security alerts and payment notifications.
                    </CardDescription>
                </CardContent>
            </Card>

            <div className="flex justify-end mt-8">
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                </Button>
            </div>
        </motion.div>
    );
}