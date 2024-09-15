import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IsVideoFileExt(file: string) {
  const extension = file.split(".").pop();
  return extension ? ["webm", "mp4"].includes(extension) : false;
}

export function IsImageFileExt(file: string) {
  const extension = file.split(".").pop();
  return extension ? ["jpg", "jpeg", "png", "webp"].includes(extension) : false;
}
