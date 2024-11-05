"use client";

import { type Session } from "next-auth";
import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import { useMDXComponents } from "mdx-components";
import type { MDXComponents, MDXProps } from "mdx/types";
import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Language } from "~/types/language-icons";
import { api } from "~/trpc/react";
import { ModifyMarkdown } from "../_actions/ModifyMarkdownAction";
import { SubmitProject } from "../_actions/SubmitProjectAction";
import MultipleFileUpload from "./MultipleFileUpload";
import { useDebounce } from "~/lib/clientutils";
import MultiSelector from "./MultiSelector";
import LoadingSymbol from "./LoadingSymbol";
import * as schema from "~/db/schema";
import Image from "next/image";

type ReactMDXContent = (props: MDXProps) => ReactNode;
type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;
const runtime = { jsx, jsxs, Fragment } as Runtime;

export default function ProjectEditor({
  session,
  projects,
}: {
  session: Session | null;
  projects: schema.SelectPost[];
}) {
  const CustomComponents: MDXComponents = useMDXComponents();

  //State for existing project editor
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null,
  );
  const [selectedID, setSelectedID] = useState(projects[0]?.id ?? 0);
  const projectQuery = api.project.getProject.useQuery(selectedID);
  const imagesQuery = api.project.getProjectImages.useQuery(selectedID);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnail, setThumbnail] = useState<File>();
  const [images, setImages] = useState<File[]>([]);
  const [source, setSource] = useState("");
  const [brief, setBrief] = useState("");
  const [pending, setPending] = useState(false);

  const handleEdit = useDebounce<[ChangeEvent<HTMLTextAreaElement>]>((e) => {
    e.persist();
    void evaluate(e.target.value, runtime).then((res) =>
      setMdxContent(() => res.default),
    );
  }, 1000);

  useEffect(() => {
    const abortController = new AbortController();

    //Either project hasn't loaded yet or user selected New Project
    if (!projectQuery.data) {
      if (thumbnailInputRef.current?.files) {
        thumbnailInputRef.current.files = new DataTransfer().files;
      }
      setThumbnail(undefined);
      setSource("");
      void evaluate("", runtime).then((res) =>
        setMdxContent(() => res.default),
      );
    } else {
      void fetch(projectQuery.data?.contentPath, {
        signal: abortController.signal,
      }).then((res) =>
        res.text().then((res) => {
          setSource(res);
          return evaluate(res, runtime).then((res) =>
            setMdxContent(() => res.default),
          );
        }),
      );
      fetch(projectQuery.data?.briefPath)
        .then((res) =>
          res.text().then((res) => {
            setBrief(res);
          }),
        )
        .catch((err) => console.error(err));
      fetch(projectQuery.data.thumbnailPath, {
        signal: abortController.signal,
      })
        .then((response) => {
          if (!response.body) return;
          const reader = response.body.getReader();
          return {
            type: response.headers.get("content-type"),
            stream: new ReadableStream({
              start(controller) {
                return pump();
                function pump() {
                  return reader
                    .read()
                    .then(({ done, value }): Promise<void> | void => {
                      // When no more data needs to be consumed, close the stream
                      if (done) {
                        controller.close();
                        return;
                      }
                      // Enqueue the next data chunk into our target stream
                      controller.enqueue(value);
                      return pump();
                    });
                }
              },
            }),
          };
        })
        // Create a new response out of the stream
        .then((stream) => ({
          type: stream?.type ?? "",
          stream: new Response(stream?.stream),
        }))
        // Create an object URL for the response
        .then(async (response) => ({
          type: response.type,
          stream: await response.stream.blob(),
        }))
        .then(
          (blob) => new File([blob.stream], "test.mp4", { type: blob.type }),
        )
        .then((image) => {
          setThumbnail(image);
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(image);
          if (thumbnailInputRef.current)
            thumbnailInputRef.current.files = dataTransfer.files;
        })
        .catch((err) => console.error(err));
    }
    return () => {
      abortController.abort();
    };
  }, [projectQuery.data, selectedID]);

  useEffect(() => {
    const abortController = new AbortController();

    setImages([]);

    if (imagesQuery.data) {
      for (const image of imagesQuery.data) {
        void fetch(image.link, { signal: abortController.signal })
          .then((response) => {
            if (!response.body) return;
            const reader = response.body.getReader();
            return {
              type: response.headers.get("content-type"),
              stream: new ReadableStream({
                start(controller) {
                  return pump();
                  function pump() {
                    return reader
                      .read()
                      .then(({ done, value }): Promise<void> | void => {
                        // When no more data needs to be consumed, close the stream
                        if (done) {
                          controller.close();
                          return;
                        }
                        // Enqueue the next data chunk into our target stream
                        controller.enqueue(value);
                        return pump();
                      });
                  }
                },
              }),
            };
          })
          // Create a new response out of the stream
          .then((stream) => ({
            type: stream?.type,
            stream: new Response(stream?.stream),
          }))
          // Create an object URL for the response
          .then(async (response) => ({
            type: response.type ?? "",
            stream: await response.stream.blob(),
          }))
          .then(
            (blob) => new File([blob.stream], "test.mp4", { type: blob.type }),
          )
          .then((image) => setImages((i) => [...i, image]))
          .catch((err) => console.error(err));
      }
    }

    return () => {
      abortController.abort();
    };
  }, [imagesQuery.data, selectedID]);

  return (
    <div className="flex h-full gap-4 px-2 text-white">
      <main className="flex h-fit min-h-fit w-[60%] max-w-[60%] flex-col items-center justify-center rounded-3xl bg-white/5 pl-8 pr-8 text-white">
        <div className="flex w-11/12 flex-grow-0 flex-col py-16">
          <MdxContent
            components={CustomComponents}
            thumbnail={projectQuery.data?.thumbnailPath}
            languages={projectQuery.data?.languages}
            images={imagesQuery.data?.map((img) => img.link)}
          ></MdxContent>
        </div>
      </main>
      <div className="border border-white"></div>
      <form className="max-w-[50%] flex-grow">
        <LoadingSymbol setFormStatus={setPending}></LoadingSymbol>
        <label htmlFor="project" className="pr-4">
          Select a project:
        </label>
        <select
          id="project"
          name="projectID"
          className="rounded-xl bg-white/10 p-2 hover:bg-white/30"
          defaultValue={projects[0]?.id ?? 0}
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

        <div
          className={`container flex flex-col px-4 ${pending ? "hidden" : ""}`}
        >
          <div className="flex w-10/12 flex-col items-center gap-8"></div>
          <label htmlFor="Title">Title: </label>
          <input
            type="text"
            name="Title"
            required={true}
            defaultValue={projectQuery.data ? projectQuery.data.title : ""}
            className="w-full flex-grow text-nowrap bg-slate-950/50 text-white"
          ></input>
          <div>
            <br></br>
          </div>
          <label htmlFor="Brief">Brief:</label>
          <textarea
            name="Brief"
            rows={3}
            cols={40}
            required={true}
            defaultValue={brief}
            className="w-full flex-grow bg-slate-950/50 text-white"
          ></textarea>
          <div>
            <br></br>
          </div>
          <label htmlFor="ghLink">Repo Link: </label>
          <input
            type="text"
            name="ghLink"
            defaultValue={
              projectQuery.data?.ghLink ? projectQuery.data.ghLink : ""
            }
            className="w-full flex-grow text-nowrap bg-slate-950/50 text-white"
          ></input>
          <div>
            <br></br>
          </div>
          <label htmlFor="Languages">Languages: </label>
          <MultiSelector name="Languages">
            {Object.values(Language).map((langName) => {
              return {
                value: langName,
                label: langName,
                selected: !!projectQuery.data?.languages?.languages.find(
                  (value) => {
                    return value === langName;
                  },
                ),
              };
            })}
          </MultiSelector>
          <div>
            <br></br>
          </div>
          <label htmlFor="Content">Content: </label>
          <textarea
            value={source}
            name="Content"
            onChange={(e) => {
              setSource(e.target.value);
              handleEdit(e);
            }}
            className="w-full flex-grow bg-slate-950/50 text-white"
            cols={50}
            rows={15}
          ></textarea>
          <div>
            <br></br>
          </div>
          <label htmlFor="Thumbnail">Thumbnail: </label>
          <div>
            <input
              type="file"
              name="Thumbnail"
              required={true}
              ref={thumbnailInputRef}
              className="inline"
              onChange={(e) =>
                e.target.files?.[0] ? setThumbnail(e.target.files[0]) : 0
              }
            ></input>
            {thumbnail ? (
              <Image
                src={URL.createObjectURL(thumbnail)}
                height={100}
                width={100}
                alt="Thumbnail"
                className="inline"
              ></Image>
            ) : null}
          </div>
          <div>
            <br></br>
          </div>
          <label htmlFor="Images">Upload images: </label>
          <MultipleFileUpload
            name="Images"
            className=""
            // defaultValue={images ? images : undefined}
          ></MultipleFileUpload>
          <div>
            <br></br>
          </div>
          <button
            type="submit"
            formAction={async (formData) => {
              await SubmitProject(formData, session);
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
