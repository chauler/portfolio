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
      <h1 className="text-[5rem] font-extrabold">{children}</h1>
    ),
    h2: ({ children }) => <h2 className="text-[3rem] font-bold">{children}</h2>,
    p: ({ children }) => <p className="text-xl">{children}</p>,
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
    ...components,
  };
}
