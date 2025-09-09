import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Sửa import ở đây

const Enable2FA: React.FC<{ userId: string }> = ({ userId }) => {
  const [otpauthUrl, setOtpauthUrl] = useState("");

  useEffect(() => {
    const fetch2FA = async () => {
      const res = await fetch(`/api/Manage/enable-2fa/${userId}`, { method: "POST" });
      const data = await res.json();
      setOtpauthUrl(data.otpauthUrl);
    };
    fetch2FA();
  }, [userId]);

  return (
    <div>
      <h2>Bật Google Authenticator</h2>
      {otpauthUrl ? (
        <QRCodeCanvas value={otpauthUrl} size={200} />
      ) : (
        <p>Đang tạo mã QR...</p>
      )}
      <p>Quét mã QR này bằng ứng dụng Google Authenticator trên điện thoại của bạn.</p>
    </div>
  );
};

export default Enable2FA;
