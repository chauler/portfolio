"use client";

import { type Session } from "next-auth";
import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import { useMDXComponents } from "mdx-components";
import type { MDXComponents, MDXProps } from "mdx/types";
import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Language } from "~/types/language-icons";
import { api } from "~/trpc/react";
import { ModifyMarkdown } from "../_actions/ModifyMarkdownAction";
import { GetUTKeyFromURL } from "~/lib/utils";
import { SubmitProject } from "../_actions/SubmitProjectAction";
import MultipleFileUpload from "./MultipleFileUpload";
import { useDebounce } from "~/lib/clientutils";
import MultiSelector from "./MultiSelector";

type ReactMDXContent = (props: MDXProps) => ReactNode;
type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;
const runtime = { jsx, jsxs, Fragment } as Runtime;

export default function ProjectEditor({
  session,
  projects,
}: {
  session: Session | null;
  projects: {
    title: string;
    id: number;
    contentPath: string;
    thumbnailPath: string;
    brief: string;
    ghLink: string | null;
    languages: {
      languages: Language[];
    } | null;
  }[];
}) {
  const CustomComponents: MDXComponents = useMDXComponents();
  const utils = api.useUtils();

  //State for existing project editor
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null,
  );
  const [selectedID, setSelectedID] = useState(1);
  const projectQuery = api.project.getProject.useQuery(selectedID);
  const [source, setSource] = useState("");

  const [newProjectSource, setNewProjectSource] = useState("");
  const handleEdit = useDebounce<[ChangeEvent<HTMLTextAreaElement>]>((e) => {
    e.persist();
    void evaluate(e.target.value, runtime).then((res) =>
      setMdxContent(() => res.default),
    );
  }, 1000);

  useEffect(() => {
    if (selectedID === 0) {
      void evaluate("", runtime).then((res) =>
        setMdxContent(() => res.default),
      );
    } else {
      if (!projectQuery.data) {
        return;
      }
      void fetch(projectQuery.data?.contentPath).then((res) =>
        res.text().then((res) => {
          setSource(res);
          return evaluate(res, runtime).then((res) =>
            setMdxContent(() => res.default),
          );
        }),
      );
    }
  }, [projectQuery.data, selectedID]);

  return (
    <div className="flex h-full text-white">
      <main className="flex min-h-full w-[60%] max-w-[60%] flex-col items-center justify-center rounded-3xl bg-white/5 pl-8 pr-8 text-white">
        <div className="flex w-11/12 flex-grow-0 flex-col py-16">
          <MdxContent components={CustomComponents}></MdxContent>
        </div>
      </main>

      <form>
        <label htmlFor="project" className="pr-4">
          Select a project:
        </label>
        <select
          id="project"
          name="projectID"
          className="rounded-xl bg-white/10 p-2 hover:bg-white/30"
          onChange={(e) => {
            setSelectedID(parseInt(e.target.value));
          }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id} className="text-black">
              {project.title}
            </option>
          ))}
          <option key={0} value={0} className="text-black">
            New project
          </option>
        </select>

        {selectedID === 0 ? (
          <div className="container flex flex-col px-4">
            <div className="flex w-10/12 flex-col items-center gap-8"></div>
            <label htmlFor="Title">Title: </label>
            <input
              type="text"
              name="Title"
              required={true}
              className="w-full flex-grow text-nowrap bg-slate-950/50 text-white"
            ></input>
            <div>
              <br></br>
            </div>
            <label htmlFor="Brief">Brief:</label>
            <textarea
              name="Brief"
              rows={5}
              cols={40}
              required={true}
              className="w-full flex-grow text-nowrap bg-slate-950/50 text-white"
            ></textarea>
            <div>
              <br></br>
            </div>
            <label htmlFor="ghLink">Repo Link: </label>
            <input
              type="text"
              name="ghLink"
              className="w-full flex-grow text-nowrap bg-slate-950/50 text-white"
            ></input>
            <div>
              <br></br>
            </div>
            <label htmlFor="Languages">Languages: </label>
            <MultiSelector name="Languages">
              {[
                { value: Language.CPP, label: "CPP" },
                { value: Language.JS, label: "JS" },
                { value: Language.OPENGL, label: "OpenGL" },
                { value: Language.C, label: "C" },
              ]}
            </MultiSelector>
            <div>
              <br></br>
            </div>
            <label htmlFor="Content">Content: </label>
            <textarea
              value={newProjectSource}
              name="Content"
              onChange={(e) => {
                setNewProjectSource(e.target.value);
                handleEdit(e);
              }}
              className="w-full flex-grow text-nowrap bg-slate-950/50 text-white"
              cols={50}
              rows={30}
            ></textarea>
            <div>
              <br></br>
            </div>
            <label htmlFor="Thumbnail">Thumbnail: </label>
            <input type="file" name="Thumbnail" required={true}></input>
            <div>
              <br></br>
            </div>
            <label htmlFor="Images">Upload images: </label>
            <MultipleFileUpload name="Images" className=""></MultipleFileUpload>
            <div>
              <br></br>
            </div>
            <button
              type="submit"
              name="submit"
              formAction={async (formData) => {
                await SubmitProject(formData);
              }}
            >
              Submit
            </button>
          </div>
        ) : (
          <>
            <button
              id="compile"
              className="rounded-xl bg-white/10 p-2 hover:bg-white/30"
              type="button"
              onClick={() => {
                if (source)
                  void evaluate(source, runtime).then((res) =>
                    setMdxContent(() => res.default),
                  );
              }}
            >
              Compile
            </button>
            <button
              id="submit"
              className="rounded-xl bg-white/10 p-2 hover:bg-white/30"
              type="submit"
              formAction={async (formData) => {
                const res = await ModifyMarkdown(formData, session);
                if (res?.errors) {
                  console.log(res.errors);
                  return;
                }
                await utils.project.getProject.invalidate(selectedID);
              }}
            >
              Submit
            </button>
            <textarea
              value={source}
              name="markdown"
              onChange={(e) => setSource(e.target.value)}
              className="w-full flex-grow text-nowrap bg-slate-950/50 text-white"
              cols={50}
              rows={30}
            ></textarea>
            <input
              type="hidden"
              name="mdxKey"
              value={
                projectQuery.data
                  ? GetUTKeyFromURL(projectQuery.data.contentPath)
                  : ""
              }
            ></input>
          </>
        )}
      </form>
    </div>
  );
}
