import React, { useState, useCallback, useRef, useEffect } from "react";
import { Track, User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload as UploadIcon, Music, Image, Loader2, CheckCircle2, X, AlertCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useUser } from '@/components/contexts/UserContext';

const GENRES = [
  { value: "indie", label: "Indie" },
  { value: "alternative", label: "Alternative" },
  { value: "rap", label: "Rap" },
  { value: "rb", label: "R&B" },
  { value: "rock", label: "Rock" },
  { value: "pop", label: "Pop" },
  { value: "electronic", label: "Electronic" },
  { value: "folk", label: "Folk" },
  { value: "jazz", label: "Jazz" },
  { value: "country", label: "Country" },
  { value: "metal", label: "Metal" },
  { value: "punk", label: "Punk" },
  { value: "experimental", label: "Experimental" }
];

// File size limits
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// --- Helper Functions ---

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const validateAudioFile = (file) => {
  if (!file) return { valid: false, error: "No file selected" };
  
  if (file.size > MAX_AUDIO_SIZE) {
    return { 
      valid: false, 
      error: `Audio file is too large (${formatFileSize(file.size)}). Maximum size allowed is ${formatFileSize(MAX_AUDIO_SIZE)}.` 
    };
  }

  // Stricter: MP3 only for maximum browser compatibility.
  const allowedTypes = ['audio/mpeg', 'audio/mp3'];
  const fileExtension = file.name.toLowerCase().split('.').pop();
  
  if (!allowedTypes.includes(file.type) || fileExtension !== 'mp3') {
    return { 
      valid: false, 
      error: "Only MP3 files are supported to ensure compatibility for all listeners." 
    };
  }

  return { valid: true, error: null };
};

const validateImageFile = (file) => {
  if (!file) return { valid: true, error: null };
  
  if (file.size > MAX_IMAGE_SIZE) {
    return { 
      valid: false, 
      error: `Image file is too large (${formatFileSize(file.size)}). Maximum size allowed is ${formatFileSize(MAX_IMAGE_SIZE)}.` 
    };
  }

  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedImageTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: "Only JPEG, PNG, and WebP images are supported." 
    };
  }

  return { valid: true, error: null };
};

const testAudioPlayback = (file) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);
    
    let resolved = false;
    
    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      audio.src = '';
    };
    
    audio.oncanplay = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve();
      }
    };
    
    audio.onerror = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        reject(new Error('Audio file cannot be played by your browser.'));
      }
    };
    
    audio.src = objectUrl;
    audio.load();
    
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        reject(new Error('Audio file validation timed out.'));
      }
    }, 5000);
  });
};

export default function UploadPage() {
  const { user: contextUser, isLoading: authLoading } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [coverError, setCoverError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
  });

  const [isTestingAudio, setIsTestingAudio] = useState(false);

  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading) {
      setUser(contextUser);
      setIsLoading(false);
    }
  }, [contextUser, authLoading]);

  const handleAudioFileSelect = useCallback(async (file) => {
    setAudioError(null);
    setAudioFile(null);
    setAudioPreview(null);
    
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setAudioError(validation.error);
      return;
    }

    setIsTestingAudio(true);
    
    try {
      await testAudioPlayback(file);
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
      setAudioError(null);
    } catch (error) {
      setAudioError(error.message || 'Audio file validation failed.');
    } finally {
      setIsTestingAudio(false);
    }
  }, []);

  const handleCoverFileSelect = useCallback((file) => {
    setCoverError(null);
    setCoverFile(null);
    setCoverPreview(null);
    
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setCoverError(validation.error);
      return;
    }

    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAudioFileSelect(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCoverFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (value) => {
    setFormData(prev => ({
      ...prev,
      genre: value
    }));
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    setAudioPreview(null);
    setAudioError(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const removeCoverFile = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setCoverError(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audioFile || !formData.title || !formData.genre || !user) {
      setUploadError("Please complete all required fields.");
      return;
    }

    const hasFirstLastName = user.first_name && user.last_name;
    const hasArtistName = user.profile?.artist_name;

    if (!hasFirstLastName && !hasArtistName) {
      setUploadError(
        "You must provide your first and last name or an artist name in your profile before uploading."
      );
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      let audioUrl = null;
      let coverUrl = null;

      try {
        const audioUploadResult = await UploadFile({
          file: audioFile,
          type: "audio",
          folder: "tracks"
        });
        audioUrl = audioUploadResult.url;
      } catch (error) {
        console.error("Error uploading audio file:", error);
        throw new Error("Failed to upload audio file. Please try again.");
      }

      if (coverFile) {
        try {
          const coverUploadResult = await UploadFile({
            file: coverFile,
            type: "image",
            folder: "covers"
          });
          coverUrl = coverUploadResult.url;
        } catch (error) {
          console.error("Error uploading cover image:", error);
          throw new Error("Failed to upload cover image. Please try again.");
        }
      }

      let artistName = user.profile?.artist_name;
      if (!artistName) {
        artistName = `${user.first_name} ${user.last_name}`;
      }

      const trackData = {
        title: formData.title.trim(),
        artist_name: artistName,
        genre: formData.genre,
        description: formData.description.trim() || null,
        audio_url: audioUrl,
        cover_art_url: coverUrl || null,
        created_by: user.email,
        average_rating: 0,
        total_votes: 0,
        created_date: new Date().toISOString(),
      };

      await Track.create(trackData);

      setUploadSuccess(true);
      setFormData({ title: "", genre: "", description: "" });
      setAudioFile(null);
      setCoverFile(null);
      setAudioPreview(null);
      setCoverPreview(null);

      setTimeout(() => {
        navigate(createPageUrl("ArtistProfile"));
      }, 2000);

    } catch (error) {
      console.error("Error uploading track:", error);
      setUploadError(error.message || "An error occurred while uploading your track. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const isFormValid = audioFile && formData.title.trim() && formData.genre && user && !uploadError && !isTestingAudio;

  if (uploadSuccess) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="material-shadow">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your track has been uploaded successfully. Redirecting to your profile...
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="material-shadow">
          <CardContent className="p-8 text-center">
            <Music className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join DripCharts to Upload</h2>
            <p className="text-gray-600 mb-6">
              Share your music with the community and get feedback from listeners around the world.
            </p>
            <Button onClick={() => navigate(createPageUrl("/"))} className="w-full bg-purple-600 hover:bg-purple-700">
              Sign Up Free to Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasFirstLastName = user.first_name && user.last_name;
  const hasArtistName = user.profile?.artist_name;

  if (!hasFirstLastName && !hasArtistName) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="material-shadow">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Before uploading music, please add your first and last name or an artist name in your profile.
            </p>
            <Button 
              onClick={() => navigate(createPageUrl("AccountSettings"))} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Go to Profile Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Upload Track</h1>
        <p className="text-lg text-gray-600">Share your music with the DripCharts community</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="material-shadow mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Audio File *</h2>
            
            {!audioFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/mpeg,audio/mp3"
                  onChange={handleAudioChange}
                  className="hidden"
                  id="audio-upload"
                  disabled={isTestingAudio}
                />
                <label
                  htmlFor="audio-upload"
                  className={`cursor-pointer ${isTestingAudio ? 'opacity-50' : ''}`}
                >
                  {isTestingAudio ? (
                    <>
                      <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">Testing audio file...</p>
                    </>
                  ) : (
                    <>
                      <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload MP3 file</p>
                      <p className="text-sm text-gray-500">Maximum file size: {formatFileSize(MAX_AUDIO_SIZE)}</p>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Music className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">{audioFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(audioFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeAudioFile}
                    disabled={isUploading}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {audioPreview && (
                  <audio controls className="w-full mt-2">
                    <source src={audioPreview} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            )}

            {audioError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{audioError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="material-shadow mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cover Art (Optional)</h2>
            
            {!coverFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                  id="cover-upload"
                  disabled={isUploading}
                />
                <label htmlFor="cover-upload" className="cursor-pointer">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload cover image</p>
                  <p className="text-sm text-gray-500">JPEG, PNG, or WebP • Max {formatFileSize(MAX_IMAGE_SIZE)}</p>
                </label>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {coverPreview && (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{coverFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(coverFile.size)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeCoverFile}
                        disabled={isUploading}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {coverError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{coverError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="material-shadow mb-6">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter track title"
                maxLength={100}
                disabled={isUploading}
                required
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre *</Label>
              <Select
                value={formData.genre}
                onValueChange={handleGenreChange}
                disabled={isUploading}
              >
                <SelectTrigger id="genre">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((genre) => (
                    <SelectItem key={genre.value} value={genre.value}>
                      {genre.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell listeners about this track..."
                maxLength={500}
                rows={4}
                disabled={isUploading}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Upload Error</p>
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={!isFormValid || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadIcon className="w-5 h-5 mr-2" />
              Upload Track
            </>
          )}
        </Button>
      </form>
    </div>
  );
}