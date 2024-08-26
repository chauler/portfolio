import Image from "next/image";
import { Language } from "../../types/language-icons";
import { CPPIcon, GHIcon, GLIcon, IconBase, JSIcon } from "./icon";

export default function Project({
  thumbnailPath,
  title,
  children,
  ghLink,
  languages,
}: {
  thumbnailPath: string;
  title: string;
  ghLink?: string;
  children?: React.ReactNode;
  languages?: Language[];
}) {
  return (
    <div className="flex w-11/12 gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
      <div className="relative h-96 w-96 flex-none">
        <Image
          src={thumbnailPath}
          alt="Project showcase picture"
          fill={true}
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex flex-col flex-wrap gap-2">
        <div className="text-accent flex justify-between gap-2 border-b border-white font-bold leading-tight tracking-tight sm:text-[3rem]">
          {title}
        </div>
        <div className="text-accent flex flex-grow flex-col justify-between break-words">
          {children}
          <div className="block flex justify-start gap-2 self-end">
            {languages
              ? languages.map((language) => {
                  switch (language) {
                    case Language.CPP:
                      return (
                        <IconBase>
                          <CPPIcon></CPPIcon>
                        </IconBase>
                      );
                    case Language.JS:
                      return (
                        <IconBase>
                          <JSIcon></JSIcon>
                        </IconBase>
                      );
                    case Language.OPENGL:
                      return (
                        <IconBase>
                          <GLIcon></GLIcon>
                        </IconBase>
                      );
                    default:
                      return null;
                  }
                })
              : null}
            {ghLink ? (
              <IconBase link={ghLink}>
                <GHIcon></GHIcon>
              </IconBase>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
