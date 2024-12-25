"use client";
import React from "react";
import {
  useState,
  useRef,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  useEffect,
} from "react";
import { cn } from "~/lib/utils";

interface Props
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "multiple" | "type" | "defaultValue" | "onChange"
  > {
  defaultValue?: File | File[];
  onAdd?: (arg0: File[]) => void;
  onDelete?: (arg0: File[]) => void;
}

function MultipleFileUpload({ defaultValue, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>(
    defaultValue
      ? Array.isArray(defaultValue)
        ? [...defaultValue]
        : [defaultValue]
      : [],
  );

  useEffect(() => {
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }
  }, [files]);

  //Update files if the provided default changes
  useEffect(() => {
    setFiles(
      defaultValue
        ? Array.isArray(defaultValue)
          ? [...defaultValue]
          : [defaultValue]
        : [],
    );
  }, [defaultValue]);

  return (
    <div className={cn("flex flex-col", props.className)}>
      <input
        {...props}
        className="file:bg-background-50 h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:mr-4 file:h-full file:max-h-12 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:text-sm file:font-semibold file:text-black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        ref={inputRef}
        type="file"
        name={props.name}
        onChange={(e) => {
          //If we selected a file and it's not a duplicate, add it to the list and call onChange if provided by parent
          if (
            e.target.files?.[0] &&
            !files.find(
              (file) =>
                file.name === e.target.files![0]?.name &&
                file.size === e.target.files![0]?.size,
            )
          ) {
            const newFiles = [...files, e.target.files[0]];
            setFiles(newFiles);
            props.onAdd?.(newFiles);
          }
        }}
      ></input>

      {/*Display to view/remove current files*/}
      <div className="">
        <p>Files uploaded:</p>
        {files.map((file, index) => (
          <div
            className="hover:cursor-pointer hover:bg-background/50"
            data-index={index}
            key={index}
            onClick={(event) => {
              const index = event.currentTarget.getAttribute("data-index");
              const newFiles = files.filter(
                (element, i) => index && i !== parseInt(index),
              );
              setFiles(newFiles);
              props.onDelete?.(newFiles);
            }}
          >
            X {file.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(MultipleFileUpload, (oldProps, newProps) => {
  let key: keyof Props;
  for (key in oldProps) {
    //Deep compare defaultValue if necessary. All other props should be shallow compared
    if (
      key === "defaultValue" &&
      Array.isArray(oldProps.defaultValue) &&
      Array.isArray(newProps.defaultValue)
    ) {
      for (const image of oldProps.defaultValue) {
        if (!newProps.defaultValue.find((newImage) => newImage === image)) {
          return false;
        }
      }
    } else {
      if (oldProps[key] !== newProps[key]) {
        return false;
      }
    }
  }
  return true;
});
