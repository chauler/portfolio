import { type ClassValue, clsx } from "clsx";
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge";
import {
  CIcon,
  CPPIcon,
  GLIcon,
  IconBase,
  JSIcon,
  PythonIcon,
  ReactIcon,
  SQLIcon,
  TSIcon,
} from "~/app/_components/icon";
import { Language } from "~/types/language-icons";

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
  return session && session.user?.role === "Admin";
}

export function IsVideoFile(file: Response) {
  return file.headers.get("content-type")?.includes("video");
}

export function LanguageIcon({
  lang,
  ...params
}: {
  lang: Language;
  className?: string;
}) {
  switch (lang) {
    case Language.C:
      return (
        <IconBase className={params.className}>
          <CIcon></CIcon>
        </IconBase>
      );
    case Language.CPP:
      return (
        <IconBase className={params.className}>
          <CPPIcon></CPPIcon>
        </IconBase>
      );
    case Language.JS:
      return (
        <IconBase className={params.className}>
          <JSIcon></JSIcon>
        </IconBase>
      );
    case Language.OPENGL:
      return (
        <IconBase className={params.className}>
          <GLIcon></GLIcon>
        </IconBase>
      );
    case Language.TS:
      return (
        <IconBase className={params.className}>
          <TSIcon></TSIcon>
        </IconBase>
      );
    case Language.SQL:
      return (
        <IconBase className={params.className}>
          <SQLIcon></SQLIcon>
        </IconBase>
      );
    case Language.PYTHON:
      return (
        <IconBase className={params.className}>
          <PythonIcon></PythonIcon>
        </IconBase>
      );
    case Language.REACT:
      return (
        <IconBase className={params.className}>
          <ReactIcon></ReactIcon>
        </IconBase>
      );
    default:
      return <></>;
  }
}
