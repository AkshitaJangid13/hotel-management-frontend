// components/common/ImageUpload.tsx
"use client";

import { useRef, useState } from "react";
import { uploadApi } from "@/lib/api";
import { ImagePlus, X, Loader2 } from "lucide-react";

type Props = {
  value?: string;        // current image name/url
  onChange: (imageName: string) => void;  // called after upload success
  label?: string;
  error?: string;
};

export default function ImageUpload({ value, onChange, label, error }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
       console.log("/images/upload", formData);
      const res = await uploadApi("/images/upload", formData); // ✅ call your upload API
      console.log(res);
      if(res?.success){
      onChange(res.data.fileName ??  res.data.url); // ✅ send image name to parent
      }
    } catch (err) {
      setUploadError("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {label && (
        <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed transition-colors cursor-pointer
          ${preview ? "border-gray-200 bg-gray-50" : "border-gray-300 hover:border-primary hover:bg-primary/5"}
          ${error ? "border-red-400" : ""}
          ${uploading ? "cursor-not-allowed opacity-70" : ""}
        `}
      >
        {/* Preview */}
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-contain rounded-lg p-2"
            />
            {/* Remove button */}
            {!uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImagePlus size={32} />
            <p className="text-sm">Click to upload image</p>
            <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}

        {/* Upload spinner overlay */}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-lg gap-2">
            <Loader2 size={24} className="animate-spin text-primary" />
            <p className="text-xs text-gray-500">Uploading...</p>
          </div>
        )}
      </div>

      {/* Errors */}
      {uploadError && (
        <p className="text-red-500 text-xs mt-1">{uploadError}</p>
      )}
      {error && !uploadError && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}