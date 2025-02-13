"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Language } from "~/types/language-icons";
import { api } from "~/trpc/react";
import { SubmitProject } from "../_actions/SubmitProjectAction";
import MultipleFileUpload from "./MultipleFileUpload";
import MultiSelector from "./MultiSelector";
import LoadingSymbol from "./LoadingSymbol";
import type * as schema from "~/db/schema";
import Image from "next/image";
import { useUploadThing } from "~/lib/uploadthing";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import MDXPreview from "./MDXPreview";
import { useQuery } from "@tanstack/react-query";

async function FetchThumbnail(path: string): Promise<File> {
  const response = await fetch(path);
  if (!response.body) throw new Error("Error fetching Thumbnail");
  const blob = await response.blob();
  const file = new File([blob], "Thumbnail", { type: blob.type });
  return file;
}

async function FetchImage(
  image: {
    id: number;
    link: string;
    name: string;
    postID: number;
  },
  abortController: AbortController,
): Promise<{ id: number; file: File; link: string }> {
  const response = await fetch(image.link, abortController);
  if (!response.body) throw new Error(`Error fetching ${image.name}`);
  const blob = await response.blob();
  const file = new File([blob], image.name, { type: blob.type });
  return { id: image.id, file: file, link: image.link };
}

export default function ProjectEditor({
  projects,
}: {
  projects: schema.SelectPost[];
}) {
  //Helper for client uploads to UT servers
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

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [selectedID, setSelectedID] = useState(
    parseInt(searchParams.get("id") ?? "0"),
  );
  const projectQuery = api.project.getProject.useQuery(selectedID, {
    staleTime: 0,
  });
  const imagesQuery = api.project.getProjectImages.useQuery(selectedID, {
    staleTime: 0,
  });

  const briefQuery = useQuery({
    queryKey: [selectedID, projectQuery.data?.briefPath],
    queryFn: async () => {
      const res = await fetch(projectQuery.data?.briefPath ?? "");
      return await res.text();
    },
    enabled: !!projectQuery.data?.briefPath,
  });

  const sourceQuery = useQuery({
    queryKey: [selectedID, projectQuery.data?.contentPath],
    queryFn: async () => {
      const res = await fetch(projectQuery.data?.contentPath ?? "");
      return await res.text();
    },
    enabled: !!projectQuery.data?.contentPath,
  });

  const thumbnailQuery = useQuery({
    queryKey: [selectedID, projectQuery.data?.thumbnailPath],
    queryFn: () => {
      return FetchThumbnail(projectQuery.data?.thumbnailPath ?? "");
    },
    enabled: !!projectQuery.data?.thumbnailPath,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // if (thumbnailQuery.data && thumbnailInputRef.current) {
  //   const dataTransfer = new DataTransfer();
  //   dataTransfer.items.add(thumbnailQuery.data);
  //   thumbnailInputRef.current.files = dataTransfer.files;
  // }

  const [thumbnail, setThumbnail] = useState<File>();
  const [images, setImages] = useState<
    { id: number; file: File; link: string }[]
  >([]);
  const [source, setSource] = useState("");
  const [brief, setBrief] = useState("");
  const [pending, setPending] = useState(false);

  //Set state for preview purposes when query returns a new thumbnail
  useEffect(() => {
    if (!thumbnailQuery.data) {
      setThumbnail(undefined);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.files = new DataTransfer().files;
      }
    } else {
      if (thumbnailInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(thumbnailQuery.data);
        thumbnailInputRef.current.files = dataTransfer.files;
      }
      setThumbnail(thumbnailQuery.data);
    }
  }, [thumbnailQuery.data]);

  useEffect(() => {
    if (!briefQuery.data) {
      setBrief("");
    } else {
      setBrief(briefQuery.data);
    }
  }, [briefQuery.data]);

  useEffect(() => {
    if (!sourceQuery.data) {
      setSource("");
    } else {
      setSource(sourceQuery.data);
    }
  }, [sourceQuery.data]);

  useEffect(() => {
    const abortController = new AbortController();

    if (imagesQuery.data) {
      Promise.all(
        imagesQuery.data.map((image) => FetchImage(image, abortController)),
      )
        .then((result) => {
          setImages(result.filter((image) => image !== undefined));
        })
        .catch((err) => console.error(err));
    }

    return () => {
      abortController.abort();
    };
  }, [imagesQuery.data]);

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
      <div className="flex h-fit min-h-fit w-2/3 flex-col items-center justify-center rounded-3xl bg-white/5 px-8 py-12">
        <MDXPreview
          thumbnailPath={projectQuery.data?.thumbnailPath}
          images={imagesQuery.data?.map((image) => image.link)}
          languages={projectQuery.data?.languages?.languages}
          content={source}
        ></MDXPreview>
      </div>
      <div className="border border-white"></div>
      <form className="w-1/3">
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
              onChange={(e) => {
                console.log(e.target.files);
                setThumbnail(e.target.files?.[0]);
              }}
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
              const [imageKeys, thumbnailKey] = await Promise.allSettled([
                images.length > 0 ? startUpload(images as File[]) : undefined,
                startUpload([thumbnail as File]),
              ]);
              formData.delete("Images");
              formData.delete("Thumbnail");

              if (
                images.length > 0 &&
                imageKeys.status === "fulfilled" &&
                imageKeys.value
              ) {
                imageKeys.value.forEach((image) => {
                  formData.append("Images", image.key);
                  formData.append("ImageNames", image.name);
                });
              } else if (!imageKeys) {
                console.log("Failed to upload images");
              }

              if (thumbnailKey.status === "fulfilled" && thumbnailKey.value) {
                thumbnailKey.value.forEach((image) =>
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
