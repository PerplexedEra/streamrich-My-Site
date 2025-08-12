'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

type FileWithPreview = {
  file: File;
  preview: string;
  type: 'image' | 'audio' | 'video' | 'archive' | 'other';
  thumbnail?: string;
  title: string;
  description: string;
  isPublic: boolean;
  isFeatured: boolean;
  tags: string[];
};

export function FileUploader() {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'browse'>('upload');
  
  const currentFile = files[currentFileIndex];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      const type = getFileType(file);
      return {
        file,
        preview: type === 'image' ? URL.createObjectURL(file) : getFileIcon(type),
        type,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        description: '',
        isPublic: true,
        isFeatured: false,
        tags: [],
      } satisfies FileWithPreview;
    });
    
    setFiles(prev => [...prev, ...newFiles]);
    setCurrentFileIndex(files.length); // Set to the first new file
  }, [files.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.aac'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/zip': ['.zip', '.rar'],
      'application/x-rar-compressed': ['.rar'],
    },
    maxSize: 1024 * 1024 * 500, // 500MB
    multiple: true,
  });

  const getFileType = (file: File): FileWithPreview['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/zip' || file.type === 'application/x-rar-compressed') return 'archive';
    return 'other';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'audio': return '/icons/audio-file.svg';
      case 'video': return '/icons/video-file.svg';
      case 'archive': return '/icons/zip-file.svg';
      default: return '/icons/file.svg';
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setFiles(prev => {
        const updated = [...prev];
        updated[index].thumbnail = reader.result as string;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpdate = (index: number, updates: Partial<FileWithPreview>) => {
    setFiles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (currentFileIndex >= index) {
      setCurrentFileIndex(prev => Math.max(0, prev - 1));
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        const formData = new FormData();
        
        // Append file data
        formData.append('file', fileData.file);
        formData.append('title', fileData.title);
        formData.append('description', fileData.description);
        formData.append('isPublic', String(fileData.isPublic));
        formData.append('isFeatured', String(fileData.isFeatured));
        formData.append('tags', JSON.stringify(fileData.tags));
        
        // Append thumbnail if exists
        if (fileData.thumbnail && fileData.thumbnail.startsWith('data:')) {
          const thumbnailBlob = await fetch(fileData.thumbnail).then(r => r.blob());
          formData.append('thumbnail', thumbnailBlob, 'thumbnail.jpg');
        }
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${fileData.file.name}`);
        }
        
        // Update progress
        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);
      }
      
      toast({
        title: 'Upload complete',
        description: `${files.length} files have been uploaded successfully`,
      });
      
      // Reset form after successful upload
      setFiles([]);
      setCurrentFileIndex(0);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred during upload',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Upload Files</h2>
          <p className="text-muted-foreground">
            Upload and manage your media files
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            onClick={() => setActiveTab('upload')}
          >
            <Icons.upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button
            variant={activeTab === 'browse' ? 'default' : 'outline'}
            onClick={() => setActiveTab('browse')}
          >
            <Icons.package className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <Icons.upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports images, audio, video, and archives (max 500MB)
              </p>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Selected Files ({files.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Icons.package className="mr-2 h-4 w-4" />
                  Add More
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {files.map((file, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-shadow ${currentFileIndex === index ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setCurrentFileIndex(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt="Thumbnail"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Icons.file className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{file.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.file.size)} • {file.type}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          <Icons.x className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* File details */}
              {currentFile !== undefined && (
                <Card>
                  <CardHeader>
                    <CardTitle>File Details</CardTitle>
                    <CardDescription>
                      Edit metadata for {currentFile.file.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={currentFile.title}
                        onChange={(e) => 
                          handleFileUpdate(currentFileIndex, { title: e.target.value })
                        }
                        placeholder="Enter a title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={currentFile.description}
                        onChange={(e) => 
                          handleFileUpdate(currentFileIndex, { description: e.target.value })
                        }
                        placeholder="Enter a description (optional)"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Thumbnail</Label>
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-md bg-muted overflow-hidden">
                            {currentFile.thumbnail ? (
                              <img
                                src={currentFile.thumbnail}
                                alt="Thumbnail preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Icons.image className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => 
                                document.getElementById('thumbnail-upload')?.click()
                              }
                            >
                              <Icons.upload className="mr-2 h-4 w-4" />
                              Upload
                            </Button>
                            <Input
                              id="thumbnail-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleThumbnailUpload(e, currentFileIndex)}
                            />
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG, or GIF (max 5MB)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="is-public">Public</Label>
                            <p className="text-xs text-muted-foreground">
                              Make this file visible to all users
                            </p>
                          </div>
                          <Switch
                            id="is-public"
                            checked={currentFile.isPublic}
                            onCheckedChange={(checked) => 
                              handleFileUpdate(currentFileIndex, { isPublic: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="is-featured">Featured</Label>
                            <p className="text-xs text-muted-foreground">
                              Show this file in featured section
                            </p>
                          </div>
                          <Switch
                            id="is-featured"
                            checked={currentFile.isFeatured}
                            onCheckedChange={(checked) => 
                              handleFileUpdate(currentFileIndex, { isFeatured: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tags input would go here */}
                  </CardContent>
                </Card>
              )}

              {/* Upload progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiles([]);
                    setCurrentFileIndex(0);
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={uploadFiles}
                  disabled={files.length === 0 || isUploading}
                >
                  {isUploading ? (
                    <>
                    {isLoading ? <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.uploadCloud className="mr-2 h-4 w-4" />}                 </>
                  ) : (
                    `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Icons.folderOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No files uploaded yet</h3>
            <p className="text-sm text-muted-foreground">
              Your uploaded files will appear here
            </p>
            <Button
              variant="outline"
              onClick={() => setActiveTab('upload')}
              className="mt-2"
            >
              <Icons.upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
