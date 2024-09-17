"use server";
import { z } from "zod";
import { utapi } from "~/server/uploadthing";
import { db } from "~/db";
import { postsTable } from "~/db/schema";
import { eq } from "drizzle-orm";
import { Session } from "next-auth";
import { IsAdmin } from "~/lib/utils";

const UploadFormData = z.object({
  projectID: z.number().nonnegative(),
  markdown: z.string().min(1),
  mdxKey: z.string().min(1),
});

export async function ModifyMarkdown(
  formData: FormData,
  session: Session | null,
) {
  if (!IsAdmin(session)) {
    return { errors: "Not authenticated" };
  }

  const validatedInput = UploadFormData.safeParse({
    projectID: parseInt(formData.get("projectID")?.toString() ?? ""),
    markdown: formData.get("markdown"),
    mdxKey: formData.get("mdxKey"),
  });

  if (!validatedInput.success) {
    console.log("validation errors");
    console.log(validatedInput.error.flatten().fieldErrors);
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  const newFile = new File(
    [new Blob([validatedInput.data.markdown])],
    "content.mdx",
    { type: "application/octet-stream" },
  );

  const response = await utapi.uploadFiles(newFile);

  if (response.error) {
    return {
      errors: "Failed to upload new file",
    };
  }

  await db
    .update(postsTable)
    .set({ contentPath: `https://utfs.io/f/${response.data.key}` })
    .where(eq(postsTable.id, validatedInput.data.projectID));
  await utapi.deleteFiles(validatedInput.data.mdxKey);
}
