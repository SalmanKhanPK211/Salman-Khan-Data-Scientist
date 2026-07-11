import profileImg from "@/assets/profile.jpg";
import certDabi from "@/assets/cert-dabi.jpg";
import certMysql from "@/assets/cert-mysql.jpeg";
import proj1 from "@/assets/project-1.jpg";
import proj2 from "@/assets/project-2.jpg";
import proj3 from "@/assets/project-3.jpg";
import proj4 from "@/assets/project-4.jpg";
import proj5 from "@/assets/project-5.jpg";
import proj6 from "@/assets/project-6.jpg";

const assetMap: Record<string, string> = {
  "asset:profile": profileImg,
  "asset:cert-dabi": certDabi,
  "asset:cert-mysql": certMysql,
  "asset:project-1": proj1,
  "asset:project-2": proj2,
  "asset:project-3": proj3,
  "asset:project-4": proj4,
  "asset:project-5": proj5,
  "asset:project-6": proj6,
};

export const resolveImageUrl = (url: string | null | undefined, fallback = ""): string => {
  if (!url) return fallback;
  if (url.startsWith("asset:")) return assetMap[url] ?? fallback;
  return url;
};

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
