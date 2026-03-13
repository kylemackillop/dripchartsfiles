
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/api/entities";
import { UserData } from "@/api/entities"; // Added UserData import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Info } from "lucide-react"; // Added Info icon
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
} from "@/components/ui/alert-dialog"; // Added AlertDialog components

// Moved formatPhoneNumber outside the component as it's a utility function
const formatPhoneNumber = (value) => {
  if (!value) return "";
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  const limited = numbers.slice(0, 10);
  
  // Format as (XXX) XXX-XXXX
  if (limited.length > 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6, 10)}`;
  } else if (limited.length > 3) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  }
  return limited;
};

export default function AccountSettingsPage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // New state for UserData
  const [formData, setFormData] = useState({
    display_name: "", // New display_name field
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    country_code: "001",
    date_of_birth: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConfirmingName, setIsConfirmingName] = useState(false); // New state for confirmation dialog
  const [newDisplayName, setNewDisplayName] = useState(""); // New state for storing the display name to confirm

  const loadProfile = useCallback(async () => {
    try {
      const authUser = await User.getCurrentUser();
      setUser(authUser);

      // Fetch UserData record for the current user
      const [userDataRecord] = await UserData.filter({ user_email: authUser.email });
      setUserData(userDataRecord);
      
      setFormData({
        display_name: userDataRecord?.display_name || "", // Set display_name from UserData
        first_name: authUser.first_name || "",
        last_name: authUser.last_name || "",
        email: authUser.email,
        phone_number: formatPhoneNumber(authUser.profile?.phone_number || ""),
        country_code: authUser.profile?.country_code || "001",
        date_of_birth: authUser.profile?.date_of_birth || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      User.login(); 
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    const newErrors = { ...errors }; // Start with existing errors

    // Display Name Validation (only if it's being set for the first time)
    if (!userData?.display_name && formData.display_name) {
        if (formData.display_name.length < 3 || formData.display_name.length > 24) {
            newErrors.display_name = "Must be between 3 and 24 characters.";
        } else {
            // Check if display name is already taken
            const existingUser = await UserData.filter({ display_name: formData.display_name });
            if (existingUser.length > 0) {
                newErrors.display_name = "This display name is already taken.";
            } else {
                delete newErrors.display_name;
            }
        }
    } else {
        delete newErrors.display_name; // Clear error if not setting a new name or if name is already set
    }

    // Validate first name
    if (formData.first_name.length > 50) {
      newErrors.first_name = "50 characters max";
    }

    // Validate last name
    if (formData.last_name.length > 50) {
      newErrors.last_name = "50 characters max";
    }

    // Validate email
    if (formData.email.length > 60) {
      newErrors.email = "60 characters max";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate country code
    const countryCodeNum = parseInt(formData.country_code);
    if (isNaN(countryCodeNum) || countryCodeNum < 1 || countryCodeNum > 895) {
      newErrors.country_code = "Invalid code";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // If new display name is being set, show confirmation dialog
    if (!userData?.display_name && formData.display_name) {
        setNewDisplayName(formData.display_name);
        setIsConfirmingName(true);
        return; // Stop the save process here, it will resume after confirmation
    }

    await saveUserData(); // If no display name to confirm, proceed with saving
  };

  const saveUserData = async (displayNameToSave = null) => {
    setIsSaving(true);
    try {
      // Extract only the numbers from the formatted phone number
      const phoneNumbers = formData.phone_number.replace(/\D/g, '');
      
      const profileUpdates = {
        phone_number: phoneNumbers,
        country_code: formData.country_code,
        date_of_birth: formData.date_of_birth,
      };
      
      await User.updateMyUserData({
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile: {
            ...user.profile,
            ...profileUpdates
        }
      });

      // If a display name needs to be saved (from confirmation)
      if (displayNameToSave && userData && userData.id) {
        await UserData.update(userData.id, { display_name: displayNameToSave });
      }

      alert("Settings saved successfully!");
      loadProfile(); // Refresh data to show updated display name status
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
      setIsConfirmingName(false); // Close confirmation dialog after save attempt
    }
  };

  const confirmDisplayName = async () => {
      await saveUserData(newDisplayName);
  };


  const handleInputChange = (field, value) => {
    let processedValue = value;
    const newErrors = { ...errors };

    if (field === 'phone_number') {
      processedValue = formatPhoneNumber(value);
    } else if (field === 'country_code') {
      // Only allow numbers and limit to 3 digits
      processedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (field === 'first_name' || field === 'last_name' || field === 'display_name') { // Added display_name
      if (value.length > 50 && (field === 'first_name' || field === 'last_name')) { // Limit for first/last name
        newErrors[field] = "50 characters max";
      } else if (value.length > 24 && field === 'display_name') { // Limit for display name
        newErrors[field] = "24 characters max";
      } else {
        delete newErrors[field];
      }
    } else if (field === 'email') {
       if (value.length > 60) {
         processedValue = value.slice(0, 60);
         newErrors.email = "60 characters max";
       } else if (!validateEmail(value) && value.length > 0) {
         newErrors.email = "Please enter a valid email";
       } else {
         delete newErrors.email;
       }
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    setErrors(newErrors);
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/4"></div><div className="h-32 bg-gray-200 rounded"></div></div></div>;
  }

  return (
    <> {/* Added React.Fragment for AlertDialog */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto py-8 px-4 max-w-2xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-lg text-gray-600">Manage your personal information.</p>
        </div>
        
        <Card className="shadow-md">
          <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => handleInputChange("display_name", e.target.value)}
                    disabled={!!userData?.display_name} // Disable if display name is already set
                    maxLength={24}
                />
                {errors.display_name && <p className="text-xs text-red-500">{errors.display_name}</p>}
                {userData?.display_name ? (
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Info className="w-3 h-3"/>Your display name is permanent and cannot be changed.</p>
                ) : (
                    <p className="text-xs text-gray-500">This will be your public name across DripCharts. It can only be set once.</p>
                )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name"
                  value={formData.first_name} 
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  maxLength={50}
                />
                {errors.first_name && <p className="text-xs text-red-500">{errors.first_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input 
                  id="last_name"
                  value={formData.last_name} 
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  maxLength={50}
                />
                {errors.last_name && <p className="text-xs text-red-500">{errors.last_name}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                value={formData.email} 
                onChange={(e) => handleInputChange("email", e.target.value)}
                maxLength={60}
                type="email"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              {!errors.email && (
                <p className="text-xs text-gray-500">Email is managed via your Google account and cannot be changed here.</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country_code">Country Code</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+</span>
                  <Input 
                    id="country_code"
                    value={formData.country_code}
                    onChange={(e) => handleInputChange("country_code", e.target.value)}
                    className="pl-6"
                    placeholder="1"
                    maxLength={3}
                  />
                </div>
                {errors.country_code && <p className="text-xs text-red-500">{errors.country_code}</p>}
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input 
                  id="phone_number"
                  value={formData.phone_number} 
                  onChange={(e) => handleInputChange("phone_number", e.target.value)} 
                  placeholder="(555) 123-4567"
                />
                <p className="text-xs text-gray-500">Phone number verification coming soon!</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input 
                id="date_of_birth"
                value={formData.date_of_birth} 
                onChange={(e) => handleInputChange("date_of_birth", e.target.value)} 
                type="date" 
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isSaving} size="lg" className="bg-[#6A12CC] hover:bg-[#26054D] text-white">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AlertDialog for Display Name Confirmation */}
      <AlertDialog open={isConfirmingName} onOpenChange={setIsConfirmingName}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Your Display Name</AlertDialogTitle>
                  <AlertDialogDescription>
                      Your display name can only be set once and cannot be changed later. Are you sure you want to set your name to
                      <span className="font-bold text-primary"> "{newDisplayName}"</span>?
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Go Back</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDisplayName}>Save</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
