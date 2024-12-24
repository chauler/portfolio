"use server";
import { z } from "zod";
import { utapi } from "~/server/uploadthing";
import { db } from "~/db";
import {
  imagesTable,
  type InsertImage,
  type InsertPost,
  postsTable,
} from "~/db/schema";
import { Language } from "~/types/language-icons";
import { GetUTKeyFromURL, IsAdmin, UtURLFromKey } from "~/lib/utils";
import type * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "~/auth/auth";

const ProjectFormData = z.object({
  projectID: z.number(),
  title: z.string().min(1),
  brief: z.string().min(1),
  content: z.string().min(1),
  thumbnail: z.string().min(1),
  ghLink: z.string(),
  languages: z.nativeEnum(Language).array(),
  images: z.string().min(1).array(),
  imageNames: z.string().min(1).array(),
});

export async function SubmitProject(formData: FormData) {
  const session = await auth();
  if (!IsAdmin(session)) {
    console.log("Not authenticated");
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
    images: formData.getAll("Images"),
    imageNames: formData.getAll("ImageNames"),
  });

  if (!validatedInput.success) {
    console.log("validation errors");
    console.log(validatedInput.error.flatten().fieldErrors);
    console.log(formData.getAll("Images"));
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  //Grab existing db entries if we are updating a post
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

  //Turn the text content into files for storage on UT
  const content = new File(
    [new Blob([validatedInput.data.content])],
    "content.mdx",
    { type: "application/octet-stream" },
  );

  const brief = new File([new Blob([validatedInput.data.brief])], "brief.mdx", {
    type: "application/octet-stream",
  });

  const response = await utapi.uploadFiles([brief, content]);

  for (const result of response) {
    if (result.error) {
      return {
        errors: "Failed to upload file",
      };
    }
  }

  const dataToUpload: InsertPost = {
    id:
      validatedInput.data.projectID !== 0
        ? validatedInput.data.projectID
        : undefined,
    title: validatedInput.data.title,
    briefPath: `${UtURLFromKey(response[0]?.data?.key ?? "")}`,
    contentPath: `${UtURLFromKey(response[1]?.data?.key ?? "")}`,
    thumbnailPath: `${UtURLFromKey(validatedInput.data.thumbnail)}`,
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

  //Stop early if we couldn't successfully insert to avoid doing anything dangerous
  if (!insertedPosts[0]?.id) return;

  const postID = insertedPosts[0].id;
  const imagesToUpload: InsertImage[] = validatedInput.data.images.map(
    (imageKey, i) => ({
      link: `${UtURLFromKey(imageKey)}`,
      postID: postID,
      name: validatedInput.data.imageNames[i],
    }),
  );

  const imageInsertResult = imagesToUpload.length
    ? await db.transaction(async (tx) => {
        await tx
          .delete(imagesTable)
          .where(eq(imagesTable.postID, validatedInput.data.projectID));
        return await tx.insert(imagesTable).values(imagesToUpload);
      })
    : undefined;

  //We are updating an existing post and successfully uploaded the new content. Delete the old
  if (existingData && insertedPosts.length > 0) {
    await utapi.deleteFiles([
      GetUTKeyFromURL(existingData.contentPath),
      GetUTKeyFromURL(existingData.thumbnailPath),
      GetUTKeyFromURL(existingData.briefPath),
    ]);
  }

  //Same with images: delete as long as we successfully uploaded the new ones
  if (existingImages && imageInsertResult?.rowsAffected) {
    await utapi.deleteFiles(
      existingImages.map((image) => {
        return GetUTKeyFromURL(image.link);
      }),
    );
  }
  console.log("Finished posting");
}
