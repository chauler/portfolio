"use client";

import { type EvaluateOptions } from "@mdx-js/mdx";
import { except } from "drizzle-orm/pg-core";
import { useMDXComponents } from "mdx-components";
import { type MDXComponents } from "mdx/types";
import { evaluateSync } from "node_modules/@mdx-js/mdx/lib/evaluate";
import { Fragment } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { jsx, jsxs } from "react/jsx-runtime";
import { type Language } from "~/types/language-icons";

type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;
const runtime = { jsx, jsxs, Fragment } as Runtime;

interface PropsType {
  components?: MDXComponents;
  thumbnailPath?: string;
  languages?: Language[];
  images?: string[];
  content: string;
  [key: string]: unknown;
}

export default function MDXPreview(props: PropsType) {
  const CustomComponents: MDXComponents = useMDXComponents();

  let MdxContent: React.FC<PropsType> | undefined;
  try {
    MdxContent = evaluateSync(props.content, runtime).default;
  } catch (error) {
    MdxContent = undefined;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <ErrorBoundary
        FallbackComponent={FallbackUI}
        onReset={() => {
          try {
            MdxContent = evaluateSync(props.content, runtime).default;
          } catch (error) {
            MdxContent = undefined;
          }
        }}
      >
        {MdxContent ? (
          <MdxContent
            {...props}
            components={{ ...CustomComponents, ...props.components }} //Allow overriding/extension of global custom MDX components
            thumbnail={props.thumbnailPath ?? ""}
            languages={props.languages ?? []}
            images={props.images ?? []}
          ></MdxContent>
        ) : (
          //We use a child component to throw the error so that we can catch it in the ErrorBoundary, triggering the fallback UI and the reload button.
          <ErrorComponent message="MDX Content was undefined"></ErrorComponent>
        )}
      </ErrorBoundary>
    </div>
  );
}

function FallbackUI({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <>
      <button
        className="w-1/4 rounded-xl border border-white hover:bg-white hover:text-black"
        onClick={resetErrorBoundary}
      >
        Reload
      </button>
      <div role="alert">
        <p>Something went wrong:</p>
        <pre className="text-wrap text-red-500">
          {HasErrorMessage(error) ? error.message : ""}
        </pre>
      </div>
    </>
  );
}

function HasErrorMessage(obj: unknown): obj is { message: string } {
  return (
    obj instanceof Object && "message" in obj && typeof obj.message === "string"
  );
}

function ErrorComponent({ message }: { message: string }) {
  throw new Error(message);
  return <></>;
}
