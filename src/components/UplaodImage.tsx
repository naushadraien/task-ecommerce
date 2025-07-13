"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";

interface UploadImageProps {
  onUpload?: (files: File[]) => void;
  onRemove?: (index: number) => void;
  maxSize?: number;
  maxFiles?: number;
  accept?: string[];
  variant?: "default" | "compact" | "grid";
  showPreview?: boolean;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  initialFiles?: File[];
  progress?: number;
  error?: string;
  success?: string;
}

export default function UploadImage({
  onUpload,
  onRemove,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 1,
  accept = ["image/*"],
  variant = "default",
  showPreview = true,
  className,
  disabled = false,
  loading = false,
  initialFiles = [],
  progress,
  error,
  success,
}: UploadImageProps) {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);

      // Generate previews
      newFiles.forEach((file, index) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews((prev) => {
              const newPreviews = [...prev];
              newPreviews[index] = e.target?.result as string;
              return newPreviews;
            });
          };
          reader.readAsDataURL(file);
        }
      });

      onUpload?.(newFiles);
    },
    [files, maxFiles, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled: disabled || loading,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onRemove?.(index);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            disabled={disabled || loading || files.length >= maxFiles}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>Upload</span>
          </Button>
          {files.length > 0 && (
            <Badge variant="secondary">
              {files.length} file{files.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={accept.join(",")}
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            onDrop(selectedFiles);
          }}
          className="hidden"
        />
        {progress !== undefined && (
          <Progress value={progress} className="h-2" />
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
            <Check className="h-4 w-4" />
            <span>{success}</span>
          </p>
        )}
      </div>
    );
  }

  // Grid variant
  if (variant === "grid") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <Card className="aspect-square overflow-hidden">
                {previews[index] ? (
                  <img
                    src={previews[index]}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Card>
              <p className="text-xs text-center mt-1 truncate">{file.name}</p>
            </div>
          ))}
          {files.length < maxFiles && (
            <Card
              {...getRootProps()}
              className={cn(
                "aspect-square border-2 border-dashed cursor-pointer transition-colors",
                "hover:border-primary/50 hover:bg-primary/5",
                isDragActive && "border-primary bg-primary/10",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <input {...getInputProps()} />
              <div className="h-full flex flex-col items-center justify-center p-4">
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  {isDragActive ? "Drop here" : "Upload"}
                </p>
              </div>
            </Card>
          )}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="h-2" />
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
            <Check className="h-4 w-4" />
            <span>{success}</span>
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("space-y-4", className)}>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-8 text-center cursor-pointer transition-all",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragActive && "border-primary bg-primary/10",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <ImageIcon className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragActive
                ? "Drop your images here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-sm text-muted-foreground">
              {accept.join(", ")} up to {formatFileSize(maxSize)}
            </p>
            {maxFiles > 1 && (
              <p className="text-xs text-muted-foreground">
                Maximum {maxFiles} files
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || loading}
            className="pointer-events-none"
          >
            {loading ? "Uploading..." : "Choose Files"}
          </Button>
        </div>
      </Card>

      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>{success}</span>
          </p>
        </div>
      )}

      {/* Preview uploaded files */}
      {showPreview && files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {previews[index] ? (
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
