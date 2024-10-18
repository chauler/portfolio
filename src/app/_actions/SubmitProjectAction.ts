"use server";
import { z } from "zod";
import { utapi } from "~/server/uploadthing";
import { db } from "~/db";
import {
  imagesTable,
  InsertImage,
  type InsertPost,
  postsTable,
} from "~/db/schema";
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
  content: z.string().min(1),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size >= 1 && file.size <= MAX_FILE_SIZE)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
  ghLink: z.string(),
  languages: z.nativeEnum(Language).array(),
  images: z
    .instanceof(File)
    .refine((file) => file.size >= 1 && file.size <= MAX_FILE_SIZE)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type))
    .array(),
});

export async function SubmitProject(formData: FormData) {
  const validatedInput = ProjectFormData.safeParse({
    title: formData.get("Title"),
    brief: formData.get("Brief"),
    content: formData.get("Content"),
    thumbnail: formData.get("Thumbnail"),
    ghLink: formData.get("ghLink"),
    languages: formData.getAll("Languages"),
    images: formData.getAll("Images"),
  });

  if (!validatedInput.success) {
    console.log("validation errors");
    console.log(validatedInput.error.flatten().fieldErrors);
    console.log(formData.getAll("Images"));
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  const newFile = new File(
    [new Blob([validatedInput.data.content])],
    "content.mdx",
    { type: "application/octet-stream" },
  );

  const responses = await Promise.all([
    utapi.uploadFiles([newFile, validatedInput.data.thumbnail]),
    utapi.uploadFiles(validatedInput.data.images),
  ]);

  for (const response of responses) {
    for (const result of response) {
      if (result.error) {
        return {
          errors: "Failed to upload file",
        };
      }
    }
  }

  const postResponse = responses[0];
  const imagesResponse = responses[1];

  const dataToUpload: InsertPost = {
    title: validatedInput.data.title,
    brief: validatedInput.data.brief,
    contentPath: `https://utfs.io/f/${postResponse[0]?.data?.key}`,
    thumbnailPath: `https://utfs.io/f/${postResponse[1]?.data?.key}`,
    ghLink: validatedInput.data.ghLink,
    languages: { languages: validatedInput.data.languages },
  };

  const insertedPosts = await db
    .insert(postsTable)
    .values(dataToUpload)
    .returning({ id: postsTable.id });
  if (!insertedPosts[0]?.id) return;
  const postID = insertedPosts[0].id;
  const imagesToUpload: InsertImage[] = imagesResponse.map((result) => ({
    link: `https://utfs.io/f/${result.data?.key}`,
    postID: postID,
  }));
  console.log("test");
  await db.insert(imagesTable).values(imagesToUpload);
}
