
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
      error: "Unsupported image format. Please use JPEG, PNG, or WebP." 
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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    lyrics: "",
    release_year: new Date().getFullYear(),
    duration: ""
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverArtFile, setCoverArtFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isTestingAudio, setIsTestingAudio] = useState(false);

  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.log('User not authenticated');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleAudioFileSelect = useCallback(async (file) => {
    setUploadError("");
    
    if (!file) {
        setAudioFile(null);
        setFormData(prev => ({ ...prev, duration: "" }));
        return;
    }

    setIsTestingAudio(true);
    
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      setAudioFile(null);
      setFormData(prev => ({ ...prev, duration: "" }));
      setIsTestingAudio(false);
      return;
    }

    try {
      await testAudioPlayback(file);
      
      setAudioFile(file);

      // Calculate duration
      const audio = document.createElement('audio');
      const objectUrl = URL.createObjectURL(file);
      audio.src = objectUrl;
      audio.preload = 'metadata';
      
      let durationCalculated = false;

      const cleanup = () => {
        URL.revokeObjectURL(objectUrl);
        audio.src = '';
      };

      audio.onloadedmetadata = () => {
        try {
          if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
            const durationStr = `${minutes}:${seconds}`;
            setFormData(prev => ({ ...prev, duration: durationStr }));
            durationCalculated = true;
          } else {
            setFormData(prev => ({ ...prev, duration: "" }));
          }
        } catch (error) {
          console.error("Error calculating duration:", error);
          setFormData(prev => ({ ...prev, duration: "" }));
        }
        cleanup();
      };
      
      audio.onerror = (error) => {
        console.error("Audio metadata loading error:", error);
        setFormData(prev => ({ ...prev, duration: "" }));
        cleanup();
      };

      setTimeout(() => {
        if (!durationCalculated) {
          console.warn("Duration calculation timed out, setting empty duration");
          setFormData(prev => ({ ...prev, duration: "" }));
          cleanup();
        }
      }, 10000);
      
    } catch (error) {
      console.error("Audio playback test failed:", error);
      // Refined error message to reflect MP3-only policy
      setUploadError(`${error.message} Please try converting your file to MP3 format.`);
      setAudioFile(null);
      setFormData(prev => ({ ...prev, duration: "" }));
    } finally {
      setIsTestingAudio(false);
    }
  }, []);

  const handleImageFileSelect = useCallback((file) => {
    setUploadError("");
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      setCoverArtFile(null);
      return;
    }
    setCoverArtFile(file);
  }, []);

  const handleInputChange = (field, value) => {
    if (field === 'lyrics' && value.length > 1000) {
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(f => f.type.startsWith("audio/"));
    const imageFile = files.find(f => f.type.startsWith("image/"));

    if (audioFile) handleAudioFileSelect(audioFile);
    if (imageFile) handleImageFileSelect(imageFile);
    
    if (!audioFile && !imageFile && files.length > 0) {
      setUploadError("Unsupported file type(s) dropped. Please drop audio or image files.");
    }
  }, [handleAudioFileSelect, handleImageFileSelect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (!audioFile || !formData.title || !formData.genre || !user) {
      setUploadError("Please fill in all required fields and select an audio file.");
      return;
    }

    const hasFirstLastName = user.first_name && user.last_name;
    const hasArtistName = user.profile?.artist_name;

    if (!hasFirstLastName && !hasArtistName) {
      setUploadError("Please complete your profile with either your First Name and Last Name, or set your Artist Name in your Artist Dashboard before uploading music.");
      return;
    }

    const audioValidation = validateAudioFile(audioFile);
    if (!audioValidation.valid) {
      setUploadError(audioValidation.error);
      return;
    }

    const imageValidation = validateImageFile(coverArtFile);
    if (!imageValidation.valid) {
      setUploadError(imageValidation.error);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setIsUploading(true);
    setUploadStep(2);

    try {
      let audioUpload = null;
      let retries = 3;
      while (retries > 0) {
        try {
          audioUpload = await UploadFile({ file: audioFile });
          break;
        } catch (error) {
          retries--;
          console.warn(`Audio upload failed. Retrying... (${retries} attempts left)`, error);
          if (retries === 0) {
              throw new Error(`Failed to upload audio file after multiple attempts: ${error.message}`);
          }
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      let coverArtUrl = "";
      if (coverArtFile) {
        let coverUpload = null;
        retries = 3;
        while (retries > 0) {
            try {
                coverUpload = await UploadFile({ file: coverArtFile });
                break;
            } catch (error) {
                retries--;
                console.warn(`Cover art upload failed. Retrying... (${retries} attempts left)`, error);
                if (retries === 0) {
                    console.error("Failed to upload cover art after multiple attempts, proceeding without it.", error);
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        if (coverUpload) {
            coverArtUrl = coverUpload.file_url;
        }
      }

      setUploadStep(3);

      let artistName = user.profile?.artist_name;
      if (!artistName && hasFirstLastName) {
        artistName = `${user.first_name} ${user.last_name}`;
      }

      await Track.create({
        ...formData,
        audio_url: audioUpload.file_url,
        cover_art_url: coverArtUrl,
        artist_name: artistName,
      });

      setUploadStep(4);
      setTimeout(() => {
        navigate(createPageUrl("ArtistProfile"));
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadStep(1);
      
      if (error.message && error.message.includes('413')) {
        setUploadError("File is too large for upload. Please use a smaller audio file.");
      } else if (error.message && (error.message.includes('Network Error') || error.message.includes('Failed to fetch'))) {
        setUploadError("Network error. Please check your internet connection and try again.");
      } else if (error.message && error.message.includes('500')) {
        setUploadError("Server error occurred during upload. Please try again or contact support if the problem persists.");
      } else {
        setUploadError("Upload failed. Please try again. " + (error.message || ""));
      }
    }
  };

  const isFormValid = audioFile && formData.title.trim() && formData.genre && user && !uploadError && !isTestingAudio;

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadStep(1);
    setAudioFile(null);
    setCoverArtFile(null);
    setFormData(prev => ({ ...prev, duration: "" }));
    setUploadError("");
    setIsTestingAudio(false);
  }

  const UploadProgress = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-4"
    >
      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
        {uploadStep === 4 ? (
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        ) : (
          <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">
          {uploadStep === 2 && "Uploading your track..."}
          {uploadStep === 3 && "Processing metadata..."}
          {uploadStep === 4 && "Upload complete!"}
        </h3>
        <p className="text-gray-600">
          {uploadStep === 2 && "Your music is being uploaded to DripCharts."}
          {uploadStep === 3 && "Adding your track to the charts."}
          {uploadStep === 4 && "Redirecting to your library..."}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${(uploadStep - 1) * 33.33}%` }}
        />
      </div>
      <div className="pt-4">
        <Button variant="outline" onClick={handleCancelUpload}>Cancel and Go Back</Button>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Card className="shadow-md p-8 max-w-md w-full">
          <CardContent>
            <UploadProgress />
          </CardContent>
        </Card>
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
            <Button onClick={() => User.login()} className="w-full bg-purple-600 hover:bg-purple-700">
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
            <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Required</h2>
            <p className="text-gray-600 mb-6">
              Please complete your profile with either your First Name and Last Name in Account Settings, 
              or set your Artist Name in your Artist Dashboard before uploading tracks.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate(createPageUrl("AccountSettings"))} className="w-full">
                Complete Account Settings
              </Button>
              <Button onClick={() => navigate(createPageUrl("ArtistProfile"))} variant="outline" className="w-full">
                Set Artist Name
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Upload Your Music</h1>
        <p className="text-lg text-gray-600">Share your sound with the community.</p>
      </div>

      {uploadError && (
        <Card className="material-shadow mb-6 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{uploadError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="shadow-md">
            <CardContent className="p-8">
                 <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                dragActive ? "border-primary bg-purple-50" : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <input
                                ref={audioInputRef}
                                type="file"
                                accept=".mp3,audio/mpeg"
                                onChange={(e) => handleAudioFileSelect(e.target.files[0])}
                                className="hidden"
                            />
                            <Music className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Audio File *</h3>
                            <p className="text-gray-500 mb-2">Drag & drop or click to browse</p>
                            <p className="text-xs text-gray-400 mb-4">Max size: {formatFileSize(MAX_AUDIO_SIZE)} | Formats: MP3 only</p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => audioInputRef.current?.click()}
                                disabled={isTestingAudio}
                            >
                                {isTestingAudio ? "Testing File..." : "Choose File"}
                            </Button>
                            {audioFile && (
                                <div className="mt-4 flex items-center justify-between bg-gray-100 rounded-lg p-4 text-left">
                                <div>
                                  <span className="text-gray-800 text-sm block">{audioFile.name}</span>
                                  <div className="flex items-center gap-x-2 text-xs text-gray-500">
                                    <span>{formatFileSize(audioFile.size)}</span>
                                    {formData.duration ? <span>• {formData.duration}</span> : <span>• Duration N/A</span>}
                                  </div>
                                </div>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                      setAudioFile(null);
                                      setFormData(prev => ({ ...prev, duration: "" }));
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                </div>
                            )}
                        </div>

                         <div className="space-y-2">
                            <Label>Cover Art (Optional)</Label>
                            <div className="border border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                                <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileSelect(e.target.files[0])}
                                className="hidden"
                                />
                                <Image className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                <p className="text-xs text-gray-400 mb-3">Max size: {formatFileSize(MAX_IMAGE_SIZE)} | Formats: JPEG, PNG, WebP</p>
                                <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => coverInputRef.current?.click()}
                                >
                                {coverArtFile ? "Change Image" : "Add Cover Art"}
                                </Button>
                                {coverArtFile && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">{coverArtFile.name}</p>
                                  <p className="text-xs text-gray-400">{formatFileSize(coverArtFile.size)}</p>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                     <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="My Awesome Song"
                            required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Genre *</Label>
                            <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)} required>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select genre" /></SelectTrigger>
                            <SelectContent>
                                {GENRES.map((genre) => (
                                <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Release Year</Label>
                            <Input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={formData.release_year}
                            onChange={(e) => handleInputChange("release_year", parseInt(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                className="h-24"
                                placeholder="Tell the story behind your track..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Lyrics (Optional)</Label>
                            <Textarea
                                value={formData.lyrics}
                                onChange={(e) => handleInputChange("lyrics", e.target.value)}
                                className="h-32"
                                placeholder="Enter your song lyrics..."
                                maxLength={1000}
                            />
                            <div className="text-xs text-gray-500 text-right">
                                {formData.lyrics.length}/1000 characters
                            </div>
                        </div>
                    </div>
                 </div>
                 <div className="flex justify-end mt-8">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={!isFormValid}
                        className={`${isFormValid 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        <UploadIcon className="w-5 h-5 mr-2" />
                        Upload to DripCharts
                    </Button>
                </div>
            </CardContent>
        </Card>
      </form>
    </div>
  );
}
