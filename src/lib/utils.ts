import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IsVideoFileExt(file: string | undefined) {
  if (!file) file = "";
  const extension = file.split(".").pop();
  return extension ? ["webm", "mp4"].includes(extension) : false;
}

export function IsImageFileExt(file: string | undefined) {
  if (!file) file = "";
  const extension = file.split(".").pop();
  return extension ? ["jpg", "jpeg", "png", "webp"].includes(extension) : false;
}

export function clamp(number: number, min = 0, max = 1) {
  return Math.max(min, Math.min(number, max));
}
