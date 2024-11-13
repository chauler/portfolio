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
import { GetUTKeyFromURL, IsAdmin } from "~/lib/utils";
import { Session } from "next-auth";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

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
  projectID: z.number(),
  title: z.string().min(1),
  brief: z.string().min(1),
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

export async function SubmitProject(
  formData: FormData,
  session: Session | null,
) {
  if (!IsAdmin(session)) {
    return { errors: "Not authenticated" };
  }

  const validatedInput = ProjectFormData.safeParse({
    projectID: parseInt(formData.get("projectID")?.toString() ?? ""),
    title: formData.get("Title"),
    brief: formData.get("Brief"),
    content: formData.get("Content"),
    thumbnail: formData.get("Thumbnail"),
    ghLink: formData.get("ghLink"),
    languages: formData.getAll("Languages"),
    images: formData
      .getAll("Images")
      .filter((image) => (image instanceof File ? image.size > 0 : 0)),
  });

  if (!validatedInput.success) {
    console.log("validation errors");
    console.log(validatedInput.error.flatten().fieldErrors);
    console.log(formData.getAll("Images"));
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  let existingData: schema.SelectPost | undefined;
  let existingImages: schema.SelectImage[] | undefined;
  if (validatedInput.data.projectID) {
    existingData = await db.query.postsTable.findFirst({
      where: (project, { eq }) => eq(project.id, validatedInput.data.projectID),
    });
    if (existingData) {
      existingImages = await db.query.imagesTable.findMany({
        where: (project, { eq }) =>
          eq(project.postID, validatedInput.data.projectID),
      });
    }
  }

  const content = new File(
    [new Blob([validatedInput.data.content])],
    "content.mdx",
    { type: "application/octet-stream" },
  );

  const brief = new File([new Blob([validatedInput.data.brief])], "brief.mdx", {
    type: "application/octet-stream",
  });

  const responses = await Promise.all([
    utapi.uploadFiles([content, validatedInput.data.thumbnail, brief]),
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
    id:
      validatedInput.data.projectID !== 0
        ? validatedInput.data.projectID
        : undefined,
    title: validatedInput.data.title,
    briefPath: `https://utfs.io/f/${postResponse[2]?.data?.key}`,
    contentPath: `https://utfs.io/f/${postResponse[0]?.data?.key}`,
    thumbnailPath: `https://utfs.io/f/${postResponse[1]?.data?.key}`,
    ghLink: validatedInput.data.ghLink,
    languages: { languages: validatedInput.data.languages },
  };

  const insertedPosts = await db
    .insert(postsTable)
    .values(dataToUpload)
    .onConflictDoUpdate({
      target: postsTable.id,
      set: { ...dataToUpload },
    })
    .returning({ id: postsTable.id });
  if (!insertedPosts[0]?.id) return;
  const postID = insertedPosts[0].id;
  const imagesToUpload: InsertImage[] = imagesResponse.map((result) => ({
    link: `https://utfs.io/f/${result.data?.key}`,
    postID: postID,
    name: result.data?.name,
  }));

  await db
    .delete(imagesTable)
    .where(eq(imagesTable.postID, validatedInput.data.projectID));
  if (imagesToUpload.length > 0)
    await db.insert(imagesTable).values(imagesToUpload);

  if (existingData) {
    await utapi.deleteFiles([
      GetUTKeyFromURL(existingData.contentPath),
      GetUTKeyFromURL(existingData.thumbnailPath),
      GetUTKeyFromURL(existingData.briefPath),
    ]);
  }
  if (existingImages) {
    await utapi.deleteFiles(
      existingImages.map((image) => {
        console.log(GetUTKeyFromURL(image.link));
        return GetUTKeyFromURL(image.link);
      }),
    );
  }
}
