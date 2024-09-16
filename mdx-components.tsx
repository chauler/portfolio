/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { MDXComponents } from "mdx/types";
import Image from "next/image";
import { IsImageFileExt, IsVideoFileExt } from "~/lib/utils";

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
      <h3 className="self-center pb-4 text-[2rem] font-bold">{children}</h3>
    ),
    p: ({ children }) => <p className="py-2 text-xl">{children}</p>,
    img: (props) => <Image {...props}></Image>,
    Image: (props: { src: string; width: number; height: number }) =>
      IsImageFileExt(props.src) ? (
        <Image {...props}></Image>
      ) : IsVideoFileExt(props.src) ? (
        <video
          src={props.src}
          autoPlay={true}
          loop={true}
          controls={false}
          muted={true}
          className="rounded-xl object-cover"
        ></video>
      ) : null,
    ul: ({ children }) => <ul className="inline list-disc py-2">{children}</ul>,
    li: ({ children }) => <li className="py-2 text-xl">{children}</li>,
    em: ({ children }) => <em className="font-bold not-italic">{children}</em>,
    ...components,
  };
}
