'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/icons';

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  category: string;
  inStock: boolean;
};

export function NewProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'beats',
    inStock: true,
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCurrentProduct(prev => ({
        ...prev,
        fileType: selectedFile.type,
        fileSize: selectedFile.size
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setCurrentProduct(prev => ({ ...prev, imageUrl: file.name }));
    }
  };

  const removeFile = () => {
    setFile(null);
    setCurrentProduct(prev => ({
      ...prev,
      fileUrl: undefined,
      fileType: undefined,
      fileSize: undefined
    }));
  };

  // File upload function
  const uploadFile = async (fileToUpload: File) => {
    const formData = new FormData();
    formData.append('file', fileToUpload);

    const response = await fetch('/api/admin/products/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    return response.json();
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      let productData = { ...currentProduct };

      // Upload file if a new one was selected
      if (file) {
        setIsUploadingFile(true);
        const uploadResult = await uploadFile(file);
        productData = {
          ...productData,
          fileUrl: uploadResult.filePath,
          fileType: uploadResult.fileType,
          fileSize: uploadResult.fileSize
        };
      }

      // Save product logic here...
      console.log('Saving product:', productData);
      setSuccess('Product saved successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploading(false);
      setIsUploadingFile(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Product Management</h2>
      
      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Product File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product File (ZIP/MP3/WAV)
            </label>
            {!currentProduct.fileUrl && !file ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Icons.upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".zip,.mp3,.wav,application/zip,audio/mpeg,audio/wav"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    ZIP, MP3, WAV up to 100MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Icons.file className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {file?.name || currentProduct.fileUrl?.split('/').pop()}
                  </span>
                  {currentProduct.fileSize && (
                    <span className="ml-2 text-xs text-gray-500">
                      {(currentProduct.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-800"
                  disabled={isUploadingFile}
                >
                  <Icons.x className="h-5 w-5" />
                  <span className="sr-only">Remove file</span>
                </button>
              </div>
            )}
            {isUploadingFile && (
              <div className="mt-2 text-sm text-gray-500">
                Uploading file...
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isUploading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
    </div>
  );
}
