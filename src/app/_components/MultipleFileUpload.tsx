"use client";
import {
  useState,
  useRef,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  useEffect,
} from "react";
import { cn } from "~/lib/utils";

type Props = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "multiple" | "type"
>;

export default function MultipleFileUpload({ ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }
  }, [files]);

  return (
    <div className={cn("flex flex-col", props.className)}>
      <input
        {...props}
        className="file:bg-background-50 h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:mr-4 file:h-full file:max-h-12 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:text-sm file:font-semibold file:text-black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        ref={inputRef}
        type="file"
        name={props.name}
        onChange={(e) => {
          setFiles(
            e.target.files?.[0] &&
              !files.find(
                (file) =>
                  file.name === e.target.files![0]?.name &&
                  file.size === e.target.files![0]?.size,
              )
              ? [...files, e.target.files[0]]
              : [...files],
          );
        }}
      ></input>
      <div className="">
        <p>Files uploaded:</p>
        {files.map((file, index) => (
          <div
            className="hover:cursor-pointer hover:bg-background/50"
            data-index={index}
            key={index}
            onClick={(event) => {
              const index = event.currentTarget.getAttribute("data-index");
              setFiles(
                files.filter((element, i) => index && i !== parseInt(index)),
              );
            }}
          >
            X {file.name}
          </div>
        ))}
      </div>
    </div>
  );
}
