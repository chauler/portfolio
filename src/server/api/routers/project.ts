import { z } from "zod";
import { db } from "~/db/index";
import type * as schema from "~/db/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ProjectRouter = createTRPCRouter({
  getProject: publicProcedure
    .input(z.number().int().nonnegative())
    .query(async ({ input }): Promise<schema.SelectPost | undefined> => {
      const project: schema.SelectPost | undefined =
        await db.query.postsTable.findFirst({
          where: (project, { eq }) => eq(project.id, input),
        });
      return project;
    }),
  getProjects: publicProcedure.query(async () => {
    const projects: schema.SelectPost[] | undefined =
      await db.query.postsTable.findMany({ limit: 10 });
    return projects;
  }),
  getProjectImages: publicProcedure
    .input(z.number().int().nonnegative())
    .query(async ({ input }) => {
      const images = await db.query.imagesTable.findMany({
        where: (image, { eq }) => eq(image.postID, input),
      });
      return images;
    }),
  getProjectIDs: publicProcedure.query(async () => {
    return await db.query.postsTable.findMany({
      columns: {
        id: true,
      },
    });
  }),
});
