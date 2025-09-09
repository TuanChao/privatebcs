import { useEffect, useState } from "react";
import { HomeNewsData } from "../Home.type";

export const useHandleNews = () => {
  const [listNews, setListNews] = useState<HomeNewsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/Manage/News/Public") // Gọi API riêng cho public
      .then(res => res.json())
      .then(data => {
        // Chuẩn hóa: luôn có trường image
        const arr = Array.isArray(data) ? data : data.data || [];
        const filteredNews = arr
          .filter((item: any) => item.isActive !== false) // Double check cho chắc
          .map((item: { image: any; avatar: any; }) => ({
            ...item,
            image: item.image || item.avatar // đồng nhất trường ảnh
          }));
        setListNews(filteredNews);
      })
      .finally(() => setLoading(false));
  }, []);

  return { listNews, loading };
};
