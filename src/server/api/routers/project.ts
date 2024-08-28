import { eq } from "drizzle-orm";
import { z } from "zod";
import { projectsData } from "~/data/projectsData";
import { db } from "~/db/index";
import * as schema from "~/db/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ProjectRouter = createTRPCRouter({
  getProject: publicProcedure
    .input(z.number().int().nonnegative())
    .query(async ({ input }) => {
      const project: schema.SelectPost | undefined =
        await db.query.postsTable.findFirst({
          where: (project, { eq }) => eq(project.id, input),
        });
      return project;
    }),
});
