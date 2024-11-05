import { type ClassValue, clsx } from "clsx";
import { Session } from "next-auth";
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

export function GetUTKeyFromURL(url: string) {
  return url.replace("https://utfs.io/f/", "");
}

export function IsAdmin(session: Session | null) {
  return session && session.user?.email === "amt1309@gmail.com";
}

export function IsVideoFile(file: Response) {
  return file.headers.get("content-type")?.includes("video");
}
