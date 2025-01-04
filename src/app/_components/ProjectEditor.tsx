"use client";

import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import { useMDXComponents } from "mdx-components";
import type { MDXComponents, MDXProps } from "mdx/types";
import {
  type ChangeEvent,
  FunctionComponent,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Language } from "~/types/language-icons";
import { api } from "~/trpc/react";
import { SubmitProject } from "../_actions/SubmitProjectAction";
import MultipleFileUpload from "./MultipleFileUpload";
import { useDebounce } from "~/lib/clientutils";
import MultiSelector from "./MultiSelector";
import LoadingSymbol from "./LoadingSymbol";
import type * as schema from "~/db/schema";
import Image from "next/image";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useUploadThing } from "~/lib/uploadthing";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type ReactMDXContent = (props: MDXProps) => ReactNode;
type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;
const runtime = { jsx, jsxs, Fragment } as Runtime;

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

export default function ProjectEditor({
  projects,
}: {
  projects: schema.SelectPost[];
}) {
  const { startUpload } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      console.log("Uploading", files.length, "files");
      return files;
    },
    onUploadBegin: (name) => {
      console.log("Beginning upload of", name);
    },
    onClientUploadComplete: (res) => {
      console.log("Upload Completed.", res.length, "files uploaded");
    },
    onUploadProgress(p) {
      console.log("onUploadProgress", p);
    },
  });
  const CustomComponents: MDXComponents = useMDXComponents();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const updateSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  //State for existing project editor
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null,
  );
  const [selectedID, setSelectedID] = useState(
    parseInt(searchParams.get("id") ?? "0"),
  );
  const projectQuery = api.project.getProject.useQuery(selectedID);
  const imagesQuery = api.project.getProjectImages.useQuery(selectedID);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnail, setThumbnail] = useState<File>();
  const [images, setImages] = useState<
    { id: number; file: File; link: string }[]
  >([]);
  const [source, setSource] = useState("");
  const [brief, setBrief] = useState("");
  const [pending, setPending] = useState(false);

  const handleEdit = useDebounce<[ChangeEvent<HTMLTextAreaElement>]>((e) => {
    e.persist();
    void evaluate(e.target.value, runtime).then((res) =>
      setMdxContent(() => res.default),
    );
  }, 1000);

  useLayoutEffect(() => {
    const abortController = new AbortController();

    //Either project hasn't loaded yet or user selected New Project
    if (!projectQuery.data) {
      if (thumbnailInputRef.current?.files) {
        thumbnailInputRef.current.files = new DataTransfer().files;
      }
      setThumbnail(undefined);
      setSource("");
      setBrief("");
      evaluate("", runtime)
        .then((res) => setMdxContent(() => res.default))
        .catch((err) => console.log(err));
    } else {
      void fetch(projectQuery.data?.contentPath, {
        signal: abortController.signal,
      }).then((res) =>
        res.text().then((res) => {
          setSource(res);
          return evaluate(res, runtime)
            .then((res) => setMdxContent(() => res.default))
            .catch((err) => console.log(err));
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
          (blob) => new File([blob.stream], "Thumbnail", { type: blob.type }),
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

  useLayoutEffect(() => {
    const abortController = new AbortController();

    if (imagesQuery.data) {
      Promise.all(
        imagesQuery.data.map((image) => {
          return (
            fetch(image.link, { signal: abortController.signal })
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
              .then((blob) => ({
                id: image.id,
                file: new File([blob.stream], image.name, { type: blob.type }),
                link: image.link,
              }))
              .catch((err) => {
                console.error(err);
                return undefined;
              })
          );
        }),
      )
        .then((result) => {
          setImages(result.filter((image) => image !== undefined));
        })
        .catch((err) => console.error(err));
    }

    return () => {
      abortController.abort();
    };
  }, [imagesQuery.data, selectedID]);

  const handleAddFile = useCallback(
    (files: File[]) => {
      //Take the new image File obj and generate a useable link and ID for use in the MDX so we can provide useful previews with images not yet uploaded to the DB
      const newFile = files.at(-1);
      if (newFile) {
        const newImage = {
          id: Math.max(...images.map((image) => image.id)) + 1,
          file: newFile,
          link: URL.createObjectURL(newFile),
        };
        setImages((images) => [...images, newImage]);
      }
    },
    [images],
  );

  const handleDeleteFile = useCallback(
    (files: File[]) => {
      if (files) {
        const newImages = images.filter((image) =>
          files.find(
            (file) =>
              file.name === image.file.name && file.size === image.file.size,
          ),
        );
        setImages(newImages);
      }
    },
    [images],
  );

  return (
    <div className="flex h-full gap-4 px-2 text-white">
      <main className="flex h-fit min-h-fit w-[60%] max-w-[60%] flex-col items-center justify-center rounded-3xl bg-white/5 pl-8 pr-8 text-white">
        <div className="flex w-11/12 flex-grow-0 flex-col py-16">
          <ErrorBoundary FallbackComponent={FallbackUI}>
            <MdxContent
              components={CustomComponents}
              thumbnail={projectQuery.data?.thumbnailPath ?? ""}
              languages={projectQuery.data?.languages ?? []}
              images={images.map((img) => img.link) ?? []}
            ></MdxContent>
          </ErrorBoundary>
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
          defaultValue={selectedID}
          onChange={(e) => {
            setSelectedID(parseInt(e.target.value));
            updateSearchParams("id", e.target.value);
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
          <div className="flex max-h-28 gap-2">
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
              thumbnail.type.includes("video") ? (
                <div className="max-h-full basis-1/3">
                  <video
                    src={URL.createObjectURL(thumbnail)}
                    controls={true}
                    muted={true}
                    className="h-full object-fill"
                  ></video>
                </div>
              ) : (
                <Image
                  src={URL.createObjectURL(thumbnail)}
                  height={100}
                  width={100}
                  alt="Thumbnail"
                  className="inline"
                ></Image>
              )
            ) : null}
          </div>
          <div>
            <br></br>
          </div>
          <label htmlFor="Images">Upload images: </label>
          <MultipleFileUpload
            name="Images"
            className=""
            defaultValue={
              images
                ? images.sort((a, b) => a.id - b.id).map((image) => image.file)
                : undefined
            }
            onAdd={handleAddFile}
            onDelete={handleDeleteFile}
          ></MultipleFileUpload>
          <div>
            <br></br>
          </div>
          <button
            type="submit"
            formAction={async (formData) => {
              const images = formData.getAll("Images");
              const thumbnail = formData.get("Thumbnail");
              //This field is required so should never be undefined - this is for the TS linter
              if (!thumbnail) {
                return;
              }

              //Get all file contents and upload direct to storage. Get keys and send those to DB
              const [imageKeys, thumbnailKey] = await Promise.all([
                images.length > 0 ? startUpload(images as File[]) : undefined,
                startUpload([thumbnail as File]),
              ]);
              formData.delete("Images");
              formData.delete("Thumbnail");

              if (images.length > 0 && imageKeys) {
                imageKeys.forEach((image) => {
                  formData.append("Images", image.key);
                  formData.append("ImageNames", image.name);
                });
              } else {
                console.log("Failed to upload images");
              }

              if (thumbnailKey) {
                thumbnailKey.forEach((image) =>
                  formData.append("Thumbnail", image.key),
                );
              } else {
                console.log("Failed to upload thumbnail");
              }

              await SubmitProject(formData);
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
