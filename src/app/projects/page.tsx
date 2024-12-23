"use server";
/* eslint-disable react/jsx-key */
import { api, HydrateClient } from "~/trpc/server";
import SignIn from "../_components/SignIn";
import { auth } from "~/auth/auth";
import ProjectEditor from "../_components/ProjectEditor";
import { IsAdmin } from "~/lib/utils";

export default async function Projects() {
  const session = await auth();
  const projects = await api.project.getProjects();

  return IsAdmin(session) ? (
    <HydrateClient>
      <ProjectEditor session={session} projects={projects}></ProjectEditor>
    </HydrateClient>
  ) : (
    <>
      <SignIn></SignIn>
      <div className="text-white">Not Authenticated - Administrator only</div>
    </>
  );
}
