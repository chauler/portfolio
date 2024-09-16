import { api, HydrateClient } from "~/trpc/server";
import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import { useMDXComponents } from "mdx-components";
import type { MDXComponents } from "mdx/types";

function Thing() {
  return <>World</>;
}

export default async function Page({ params }: { params: { id: string } }) {
  const project = await api.project.getProject(Number.parseInt(params.id));
  const res = await fetch(project?.contentPath ?? "");
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

  console.log(project?.thumbnailPath);

  return (
    <HydrateClient>
      <main className="container flex min-h-full flex-col items-center justify-center rounded-3xl bg-white/5 text-white">
        <div className="flex w-11/12 flex-col py-16">
          <MDXContent
            components={{ ...CustomComponents }}
            image={project?.thumbnailPath}
          ></MDXContent>
        </div>
      </main>
    </HydrateClient>
  );
}
