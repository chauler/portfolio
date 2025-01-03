import Image from "next/image";
import { Language } from "../../types/language-icons";
import {
  CIcon,
  CPPIcon,
  GHIcon,
  GLIcon,
  IconBase,
  JSIcon,
  TSIcon,
} from "./icon";
import { IsVideoFile, IsVideoFileExt, LanguageIcon } from "~/lib/utils";
import Link from "next/link";
import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import { useMDXComponents } from "mdx-components";
import type { MDXComponents } from "mdx/types";
import { api } from "~/trpc/server";

export default async function Project({
  id,
  thumbnailPath,
  title,
  briefPath,
  ghLink,
  languages,
}: {
  id: number;
  thumbnailPath: string;
  title: string;
  briefPath: string;
  ghLink?: string;
  languages?: Language[];
}) {
  const thumbnail = await fetch(thumbnailPath);
  const images = await api.project.getProjectImages(id);
  const res = await fetch(briefPath);
  const markdown = await res.text();

  const code = String(
    await compile(markdown, { outputFormat: "function-body" }),
  );

  const CustomComponents: MDXComponents = useMDXComponents();

  // @ts-expect-error: `runtime` types are currently broken.
  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  if (!markdown) {
    return <></>;
  }

  return (
    <div className="flex w-11/12 justify-center transition hover:scale-[101%]">
      <div className="flex w-full flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 md:flex-row">
        <div className="relative aspect-square w-full max-w-full flex-none md:w-[30%]">
          {IsVideoFile(thumbnail) ? (
            <video
              src={thumbnailPath}
              autoPlay={true}
              loop={true}
              controls={false}
              muted={true}
              className="rounded-xl object-cover"
            ></video>
          ) : (
            <Image
              src={thumbnailPath}
              alt="Project showcase picture"
              fill={true}
              className="rounded-xl object-cover"
            />
          )}
        </div>
        <div className="flex flex-grow flex-col flex-wrap gap-2">
          <div className="flex justify-between gap-2 border-b border-white text-[2rem] font-bold leading-tight tracking-tight text-accent sm:text-[3rem]">
            <a className="hover:underline" href={`/projects/${id}`}>
              {title}
            </a>
          </div>
          <div className="flex flex-grow flex-col justify-between break-words text-accent">
            <div className="">
              <MDXContent
                components={{ ...CustomComponents }}
                thumbnail={thumbnail}
                languages={languages}
                images={images.map((img) => img.link)}
              ></MDXContent>
            </div>
            <div className="block flex h-[2.2rem] min-h-8 items-center justify-start gap-2 self-end">
              <div className="flex max-h-[90%] min-w-8 flex-grow gap-2">
                {languages
                  ? languages.map((language, index) => (
                      <LanguageIcon
                        lang={language}
                        key={title + language}
                      ></LanguageIcon>
                    ))
                  : null}
              </div>
              <div className="self-stretch border-l-[1px] border-white"></div>
              <div className="min-w-8 text-center">
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
    </div>
  );
}
