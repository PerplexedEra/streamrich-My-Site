'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { ContentType, PlatformType } from '@prisma/client';

type Plan = {
  id: string;
  name: string;
};

export function EnhancedFileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { data: session } = useSession();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'MUSIC' as ContentType,
    platform: 'OTHER' as PlatformType,
    planId: '',
    isPublic: true,
    isFeatured: false,
    isTopListed: false,
    pointsAwarded: 1,
  });

  // Load available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        }
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };
    
    fetchPlans();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 
      'audio/mpeg', 'audio/wav', 'audio/mp3',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload an image, audio, or video file.');
      return;
    }

    // Set file and preview
    setFile(selectedFile);
    
    // Create preview for images/videos
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      
      // Auto-set type to MUSIC for images (assuming cover art)
      setFormData(prev => ({
        ...prev,
        type: 'MUSIC',
        title: selectedFile.name.replace(/\.[^/.]+$/, '') // Remove file extension
      }));
    } else if (selectedFile.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(selectedFile);
      setPreview(videoUrl);
      
      // Auto-set type to VIDEO for video files
      setFormData(prev => ({
        ...prev,
        type: 'VIDEO',
        title: selectedFile.name.replace(/\.[^/.]+$/, '')
      }));
      
      // Get video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        setDuration(Math.round(video.duration));
        URL.revokeObjectURL(video.src);
      };
      video.src = videoUrl;
    } else if (selectedFile.type.startsWith('audio/')) {
      const audioUrl = URL.createObjectURL(selectedFile);
      
      // Auto-set type to MUSIC for audio files
      setFormData(prev => ({
        ...prev,
        type: 'MUSIC',
        title: selectedFile.name.replace(/\.[^/.]+$/, '')
      }));
      
      // Get audio duration
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        setDuration(Math.round(audio.duration));
        URL.revokeObjectURL(audioUrl);
      };
      audio.src = audioUrl;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !session?.user) {
      setError('Please select a file to upload');
      return;
    }

    // Validate form
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    
    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('platform', formData.platform);
    formDataToSend.append('isPublic', String(formData.isPublic));
    formDataToSend.append('isFeatured', String(formData.isFeatured));
    formDataToSend.append('isTopListed', String(formData.isTopListed));
    formDataToSend.append('pointsAwarded', String(formData.pointsAwarded));
    formDataToSend.append('duration', String(duration));
    
    if (formData.planId) {
      formDataToSend.append('planId', formData.planId);
    }

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          setSuccess('File uploaded successfully!');
          
          // Store the uploaded content in session storage for the success page
          sessionStorage.setItem('uploadedContent', JSON.stringify(response.content));
          
          // Redirect to success page
          router.push('/admin/upload-success');
          
          // Reset form after a short delay to allow the success message to be seen
          setTimeout(() => {
            resetForm();
          }, 1000);
        } else {
          let errorMessage = 'Upload failed';
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Failed to parse error response:', e);
          }
          setError(errorMessage);
        }
        setIsUploading(false);
      };
      
      xhr.onerror = () => {
        setError('Network error during upload');
        setIsUploading(false);
      };
      
      xhr.open('POST', '/api/upload', true);
      xhr.setRequestHeader('Authorization', `Bearer ${session.accessToken}`);
      xhr.send(formDataToSend);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred during upload');
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setDuration(0);
    setFormData({
      title: '',
      description: '',
      type: 'MUSIC',
      platform: 'OTHER',
      planId: '',
      isPublic: true,
      isFeatured: false,
      isTopListed: false,
      pointsAwarded: 1,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render file preview based on type
  const renderPreview = () => {
    if (!preview) return null;
    
    if (file?.type.startsWith('image/')) {
      return (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Image Preview</h3>
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-full h-auto max-h-64 rounded-md object-cover"
          />
        </div>
      );
    } else if (file?.type.startsWith('video/')) {
      return (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Video Preview</h3>
          <video
            ref={videoRef}
            src={preview}
            controls
            className="max-w-full h-auto max-h-64 rounded-md"
          />
        </div>
      );
    } else if (file?.type.startsWith('audio/')) {
      return (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="text-sm font-medium mb-2">Audio Preview</h3>
          <audio
            ref={audioRef}
            src={preview}
            controls
            className="w-full"
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Content</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload and manage your media content. Allowed formats: images, audio, and video files.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
          <div className="flex">
            <Icons.alertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
          <div className="flex">
            <Icons.checkCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{success}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Media File <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Icons.uploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={isUploading}
                    accept="image/*,audio/*,video/*"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF, MP3, WAV, MP4 up to 50MB
              </p>
            </div>
          </div>
          {file && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Preview Section */}
        {preview && renderPreview()}

        {/* Progress Bar */}
        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              required
              disabled={isUploading}
            />
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              disabled={isUploading}
            >
              <option value="MUSIC">Music</option>
              <option value="VIDEO">Video</option>
              <option value="PODCAST">Podcast</option>
            </select>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              disabled={isUploading}
            >
              <option value="YOUTUBE">YouTube</option>
              <option value="SPOTIFY">Spotify</option>
              <option value="SOUNDCLOUD">SoundCloud</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <label htmlFor="planId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Plan (Optional)
            </label>
            <select
              id="planId"
              name="planId"
              value={formData.planId}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              disabled={isUploading || plans.length === 0}
            >
              <option value="">No plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          {/* Points Awarded */}
          <div className="space-y-2">
            <label htmlFor="pointsAwarded" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Points Awarded
            </label>
            <input
              type="number"
              name="pointsAwarded"
              id="pointsAwarded"
              min="1"
              value={formData.pointsAwarded}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              disabled={isUploading}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Points awarded to users for watching/listening to this content
            </p>
          </div>

          {/* Duration (auto-detected) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                value={duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '0:00'}
                disabled
                className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">min:sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            placeholder="Add a description for your content"
            disabled={isUploading}
          />
        </div>

        {/* Toggle Options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                disabled={isUploading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isPublic" className="font-medium text-gray-700 dark:text-gray-300">
                Public
              </label>
              <p className="text-gray-500 dark:text-gray-400">Make this content visible to all users</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                disabled={isUploading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isFeatured" className="font-medium text-gray-700 dark:text-gray-300">
                Featured
              </label>
              <p className="text-gray-500 dark:text-gray-400">Show in featured section</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isTopListed"
                name="isTopListed"
                type="checkbox"
                checked={formData.isTopListed}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                disabled={isUploading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isTopListed" className="font-medium text-gray-700 dark:text-gray-300">
                Top Listed
              </label>
              <p className="text-gray-500 dark:text-gray-400">Show at the top of listings</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={resetForm}
            disabled={isUploading || (!file && !formData.title)}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isUploading || !file || !formData.title}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Icons.loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              'Upload Content'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
