'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/icons';
import { toast } from '@/components/ui/use-toast';

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    fileUrl?: string;
    category: string;
    inStock: boolean;
  };
  isEditing?: boolean;
  onSuccess?: () => void;
}

const CATEGORIES = [
  { value: 'BEATS', label: 'Beats' },
  { value: 'PRESETS', label: 'Presets' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'SAMPLE_PACK', label: 'Sample Pack' },
  { value: 'MIDI', label: 'MIDI' },
  { value: 'OTHER', label: 'Other' },
];

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '0',
    category: initialData?.category || 'BEATS', // Default to uppercase BEATS
    inStock: initialData?.inStock ?? true,
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || '');
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(
    initialData?.fileUrl
      ? {
          name: initialData.fileUrl.split('/').pop() || 'Download file',
          size: 0,
          type: '',
        }
      : null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/\D/g, '') : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      inStock: checked,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadFile = async (fileToUpload: File, type: 'file' | 'image') => {
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload file');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let fileUrl = initialData?.fileUrl;
      let imageUrl = initialData?.imageUrl;

      // Upload new file if selected
      if (file) {
        const fileResult = await uploadFile(file, 'file');
        fileUrl = fileResult.filePath;
      }

      // Upload new image if selected
      if (imageFile) {
        const imageResult = await uploadFile(imageFile, 'image');
        imageUrl = imageResult.filePath;
      }

      // Prepare product data with uppercase category
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        category: formData.category.toUpperCase(), // Ensure category is uppercase
        fileUrl,
        fileType: file?.type || initialData?.fileUrl?.split('.').pop() || '',
        fileSize: file?.size || 0,
        imageUrl,
      };
      
      console.log('Submitting product data:', productData);

      // Update or create product
      const url = isEditing && initialData?.id 
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products';
      
      const method = isEditing && initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to save product');
      }

      toast({
        title: 'Success',
        description: isEditing 
          ? 'Product updated successfully' 
          : 'Product created successfully',
      });

      // Redirect to products list
      router.push('/admin/products');
      router.refresh();

    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: error instanceof Error 
          ? error.message 
          : 'Failed to save product',
        variant: 'destructive' as const,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label>Product File</Label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".zip,.mp3,.wav"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full md:w-auto"
            >
              <Icons.upload className="mr-2 h-4 w-4" />
              {fileInfo ? 'Change File' : 'Upload File'}
            </Button>
            {fileInfo && (
              <div className="text-sm text-muted-foreground">
                {fileInfo.name} ({(fileInfo.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: .zip, .mp3, .wav (max 100MB)
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Product Image</Label>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-md overflow-hidden border">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Icons.image className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                className="w-full md:w-auto"
              >
                <Icons.upload className="mr-2 h-4 w-4" />
                {previewUrl ? 'Change Image' : 'Upload Image'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommended size: 800x800px (1:1 ratio)
              </p>
            </div>
          </div>
        </div>

        {/* In Stock Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
