import { z } from "zod";
import { projectsData } from "~/data/projectsData";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ProjectRouter = createTRPCRouter({
  getLatest: publicProcedure
    .input(z.number().int().nonnegative())
    .query(({ input }) => {
      return projectsData.at(input) ?? null;
    }),
});
