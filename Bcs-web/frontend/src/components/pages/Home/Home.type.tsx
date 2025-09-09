export interface HomeKOLs {
  id: number;
  name: string;
  avatar: string;
  description: string;
}

export type HomeNewsData = {
  id: number;
  name: string;
  title: string;
  avatar?: string;
  image?: string; // Thêm dòng này
  // ...các trường khác
};


