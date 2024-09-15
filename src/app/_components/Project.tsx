import Image from "next/image";
import { Language } from "../../types/language-icons";
import { CPPIcon, GHIcon, GLIcon, IconBase, JSIcon } from "./icon";
import type { MDXComponents } from "mdx/types";
import Thing from "~/data/SpoutEffects.mdx";
import { IsVideoFileExt } from "~/lib/utils";
import Link from "next/link";

export default function Project({
  id,
  thumbnail,
  title,
  children,
  ghLink,
  languages,
}: {
  id: number;
  thumbnail: string;
  title: string;
  ghLink?: string;
  children?: React.ReactNode;
  languages?: Language[];
}) {
  return (
    <div className="flex w-11/12 justify-center">
      <Link href={`./projects/${id}`}>
        <div className="flex w-full flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 md:flex-row">
          <div className="relative aspect-square w-full max-w-full flex-none md:w-[30%]">
            {IsVideoFileExt(thumbnail) ? (
              <video
                src={thumbnail}
                autoPlay={true}
                loop={true}
                controls={false}
                muted={true}
                className="rounded-xl object-cover"
              ></video>
            ) : (
              <Image
                src={thumbnail}
                alt="Project showcase picture"
                fill={true}
                className="rounded-xl object-cover"
              />
            )}
          </div>
          <div className="flex flex-col flex-wrap gap-2">
            <div className="flex justify-between gap-2 border-b border-white text-[2rem] font-bold leading-tight tracking-tight text-accent sm:text-[3rem]">
              {title}
            </div>
            <div className="flex flex-grow flex-col justify-between break-words text-accent">
              {children}
              <div className="block flex justify-start gap-2 self-end">
                {languages
                  ? languages.map((language, index) => {
                      switch (language) {
                        case Language.CPP:
                          return (
                            <IconBase key={index}>
                              <CPPIcon></CPPIcon>
                            </IconBase>
                          );
                        case Language.JS:
                          return (
                            <IconBase key={index}>
                              <JSIcon></JSIcon>
                            </IconBase>
                          );
                        case Language.OPENGL:
                          return (
                            <IconBase key={index}>
                              <GLIcon></GLIcon>
                            </IconBase>
                          );
                        default:
                          return null;
                      }
                    })
                  : null}
                <div className="ml-3 min-w-8 text-center">
                  {ghLink ? (
                    <IconBase link={ghLink}>
                      <GHIcon></GHIcon>
                    </IconBase>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
