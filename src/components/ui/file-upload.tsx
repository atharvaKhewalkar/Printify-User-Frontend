import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  selectedFile, 
  className 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
    setDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-95",
        isDragActive || dragActive 
          ? "border-primary bg-primary/10 shadow-lg animate-scale-in" 
          : "border-border bg-card hover:border-primary/50 hover:shadow-md",
        className
      )}
    >
      <input {...getInputProps()} />
      {selectedFile ? (
        <div className="flex items-center justify-center space-x-3 animate-fade-in">
          <File className="w-8 h-8 text-primary flex-shrink-0" />
          <div className="flex-1 text-left min-w-0">
            <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-destructive/10 rounded-full transition-colors duration-200 flex-shrink-0 touch-manipulation"
            aria-label="Remove file"
          >
            <X className="w-4 h-4 text-destructive" />
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto" />
          <div>
            <p className="text-base sm:text-lg font-medium text-foreground">Upload File</p>
            <p className="text-sm text-muted-foreground mt-1 px-2">
              Drag and drop your file here, or tap to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, DOC, DOCX, PNG, JPG
            </p>
          </div>
        </div>
      )}
    </div>
  );
};