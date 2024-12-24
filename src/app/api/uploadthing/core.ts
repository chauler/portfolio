import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "~/auth/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 10 },
    video: { maxFileSize: "64MB", maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      const session = await auth();
      if (session?.user.role !== "Admin") {
        // If you throw, the user will not be able to upload
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");
        return {};
      }

      // // Whatever is returned here is accessible in onUploadComplete as `metadata`
      // return { userId: session.user.id };
      return { userId: 1 };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { key: file.key, name: file.name };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
