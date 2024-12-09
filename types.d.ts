interface Video {
  id: string;
  title: string;
  description: string;
  publicId: string;
  originSize: number;
  compressedSize: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}
