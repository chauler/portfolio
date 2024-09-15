import { api, HydrateClient } from "~/trpc/server";
import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import { useMDXComponents } from "mdx-components";
import { MDXComponents } from "mdx/types";

function Thing() {
  return <>World</>;
}

/*
TODO: VERIFY IF THUMBNAIL IS AN IMAGE OR VIDEO
*/
export default async function Page({ params }: { params: { id: string } }) {
  const project = await api.project.getProject(Number.parseInt(params.id));
  const res = await fetch(project?.contentPath ?? "");
  const markdown = await res.text();

  console.log(markdown);

  const code = String(
    await compile(markdown, { outputFormat: "function-body" }),
  );

  const CustomComponents: MDXComponents = useMDXComponents();

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
        <div className="w-11/12 py-16">
          <MDXContent
            components={{ Thing, ...CustomComponents }}
            image={project?.thumbnailPath}
          ></MDXContent>
        </div>
      </main>
    </HydrateClient>
  );
}
