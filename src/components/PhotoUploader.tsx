'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

type PhotoUploaderProps = {
  currentPhotos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  label?: string;
};

export function PhotoUploader({
  currentPhotos,
  onPhotosChange,
  maxPhotos = 10,
  label = 'Photos',
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (currentPhotos.length + files.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed');
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          setError('File size must be less than 5MB');
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('yurt-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError(uploadError.message);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('yurt-photos')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onPhotosChange([...currentPhotos, ...uploadedUrls]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2 font-inter uppercase tracking-wider">
        {label} ({currentPhotos.length}/{maxPhotos})
      </label>

      {currentPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {currentPhotos.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <Image
                src={url}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover rounded border border-white/20"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                title="Remove photo"
              >
                ×
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-inter">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {currentPhotos.length < maxPhotos && (
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm text-white/70 font-inter
              file:mr-4 file:py-2 file:px-4
              file:border file:border-white/30
              file:text-sm file:font-medium
              file:bg-transparent file:text-white/80
              hover:file:bg-white/10
              file:cursor-pointer
              file:uppercase file:tracking-wider
              disabled:opacity-50"
          />
          <p className="text-xs text-white/40 mt-2 font-inter">
            Max {maxPhotos} photos, up to 5MB each. First photo will be the main image.
          </p>
        </div>
      )}

      {uploading && (
        <p className="text-sm text-white/60 mt-2 font-inter">Uploading...</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-2 font-inter">{error}</p>
      )}
    </div>
  );
}
