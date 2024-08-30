"use server";
import { z } from "zod";
import { utapi } from "~/server/uploadthing";
import { db } from "~/db";
import { type InsertPost, postsTable } from "~/db/schema";
import { Language } from "~/types/language-icons";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/webm",
  "video/mp4",
];

const ProjectFormData = z.object({
  title: z.string().min(1),
  brief: z.string(),
  content: z
    .instanceof(File)
    .refine(
      (file) =>
        file.size >= 1 &&
        file.size <= MAX_FILE_SIZE &&
        file.type === "application/octet-stream",
    )
    .refine((file) => {
      const fileType = file.name.split(".").pop();
      return fileType === "mdx";
    }),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size >= 1 && file.size <= MAX_FILE_SIZE)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
  ghLink: z.string(),
  languages: z.nativeEnum(Language).array(),
});

export async function SubmitProject(formData: FormData) {
  const validatedInput = ProjectFormData.safeParse({
    title: formData.get("Title"),
    brief: formData.get("Brief"),
    content: formData.get("Content"),
    thumbnail: formData.get("Thumbnail"),
    ghLink: formData.get("ghLink"),
    languages: formData.getAll("Languages"),
  });

  if (!validatedInput.success) {
    console.log("validation errors");
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  const response = await utapi.uploadFiles([
    validatedInput.data.content,
    validatedInput.data.thumbnail,
  ]);

  for (const result of response) {
    if (result.error) {
      return {
        errors: "Failed to upload file",
      };
    }
  }

  const dataToUpload: InsertPost = {
    title: validatedInput.data.title,
    brief: validatedInput.data.brief,
    contentPath: `https://utfs.io/f/${response[0]?.data?.key}`,
    thumbnailPath: `https://utfs.io/f/${response[1]?.data?.key}`,
    ghLink: validatedInput.data.ghLink,
    languages: { languages: validatedInput.data.languages },
  };

  await db.insert(postsTable).values(dataToUpload);
}
