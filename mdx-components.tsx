/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from "react";
import { MDXComponents } from "mdx/types";
import Image, { ImageLoaderProps } from "next/image";
import { IsImageFileExt, IsVideoFileExt } from "~/lib/utils";
import z, { string } from "zod";
import { cn } from "src/lib/utils";

// This file is required to use @next/mdx in the `app` directory.
export function useMDXComponents(components?: MDXComponents): MDXComponents {
  //return components;
  // Allows customizing built-in components, e.g. to add styling.
  return {
    h1: ({ children }) => (
      <h1 className="self-center py-3 text-[5rem] font-extrabold">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="pb-4 text-[3rem] font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="pb-4 text-[2rem] font-bold">{children}</h3>
    ),
    p: ({ children }) => <p className="py-2 text-xl">{children}</p>,
    a: (props) => (
      <a
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        href={props.href}
        target="_blank"
      >
        {props.children}
      </a>
    ),
    Image: (props) => (
      <Image
        {...props}
        width={500}
        height={500}
        objectFit="fill"
        alt="test"
      ></Image>
    ),
    Video: ({
      src,
      className,
    }: {
      src: string;
      className: string | undefined;
    }) => (
      <video
        src={src ?? ""}
        className={cn("rounded-xl object-cover", className)}
        autoPlay={true}
        loop={true}
        controls={false}
        muted={true}
      ></video>
    ),
    // Image: (props: { src: string; width: number; height: number }) => {
    //   if (!ImageProps.safeParse(props).success) {
    //     console.log("Invalid props");
    //     return null;
    //   }
    //   return IsImageFileExt(props.src) ? (
    //     <Image {...props}></Image>
    //   ) : IsVideoFileExt(props.src) ? (
    //     <video
    //       src={props.src}
    //       autoPlay={true}
    //       loop={true}
    //       controls={false}
    //       muted={true}
    //       className="rounded-xl object-cover"
    //     ></video>
    //   ) : (
    //     () => {
    //       console.log("No file extension");
    //       return null;
    //     }
    //   );
    // },
    ul: ({ children }) => (
      <ul className="inline list-disc py-2 [&_ul>li]:ml-4 [&_ul]:list-[circle]">
        {children}
      </ul>
    ),
    li: ({ children }) => <li className="py-2 text-xl">{children}</li>,
    em: ({ children }) => <em className="font-bold not-italic">{children}</em>,
    ...components,
  };
}

const ImageProps = z.object({
  src: z.string(),
});
