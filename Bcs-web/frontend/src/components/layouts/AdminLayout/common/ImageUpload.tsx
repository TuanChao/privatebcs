import React, { useState } from "react";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  uploadApi?: string; // endpoint upload, mặc định /api/Manage/UploadPosterImage
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  uploadApi = "/api/Manage/Image", // ✅ Sử dụng endpoint đúng
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra file size (max 10MB cho ảnh chất lượng cao)
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file nhỏ hơn 10MB\n" +
              "Ảnh 4K có thể rất nặng, nên compress trước khi upload.");
        return;
      }

      // Kiểm tra file type
      if (!file.type.startsWith('image/')) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }

      // Cảnh báo nếu file lớn (>2MB)
      if (file.size > 2 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const shouldContinue = window.confirm(
          `File có kích thước ${sizeMB}MB - khá lớn!\n` +
          `Ảnh lớn sẽ tải chậm cho user.\n` +
          `Bạn có muốn tiếp tục upload không?`
        );
        if (!shouldContinue) return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch(uploadApi, { method: "POST", body: formData });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        // ✅ Backend trả về { url: "/uploads/filename.jpg" }
        if (data.url && !data.url.startsWith('data:image/')) {
          onChange(data.url);
        } else if (data.image && !data.image.startsWith('data:image/')) {
          onChange(data.image);
        } else if (typeof data === 'string' && !data.startsWith('data:image/')) {
          onChange(data);
        } else {
          console.error("Expected URL but got base64:", data);
          alert("Upload thất bại: Server trả về base64 thay vì URL path");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert(`Upload thất bại: ${error}\n\nẢnh quá lớn có thể gây timeout server.`);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p style={{ color: '#666', fontSize: '14px' }}>Đang upload...</p>}
      {value && (
        <img
          src={value}
          alt="preview"
          style={{ 
            width: 80, 
            height: 60, 
            objectFit: "cover", 
            marginTop: 8,
            border: '1px solid #ddd',
            borderRadius: 4
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
};

export default ImageUpload;
