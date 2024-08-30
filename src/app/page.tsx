import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import Header from "./_components/Header";
import Project from "./_components/Project";
import { api } from "~/trpc/server";

export default async function Home() {
  const projects = await api.project.getProjects();

  return (
    <HydrateClient>
      <main className="flex min-h-full flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Header>Hey, I&apos;m Alex.</Header>
          <h2 className="max-w-2xl text-center text-lg font-bold leading-none tracking-tight md:text-2xl">
            I&apos;m Alex Tomjack, a computer science graduate from the
            University of North Texas, currently studying for my master&apos;s
            at the University of Nebraska-Omaha.
          </h2>
          <div className="flex justify-between gap-2 sm:gap-4 md:gap-8">
            <Link
              className="flex max-w-xs gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="./projects"
            >
              <h3 className="whitespace-nowrap text-2xl font-bold">
                Submit a new Project →
              </h3>
            </Link>
            <Link
              className="flex max-w-xs justify-between gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="resume.pdf"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Resume →</h3>
            </Link>
          </div>
          <Header>Projects</Header>
          {projects
            ? projects.map((project) => {
                return (
                  <Project
                    key={project.id}
                    id={project.id}
                    thumbnail={{
                      video: ["webm", "mp4"].includes(
                        project.thumbnailPath.split(".").pop() ?? "",
                      ),
                      path: project.thumbnailPath,
                    }}
                    title={project.title}
                    ghLink={project.ghLink ?? ""}
                    languages={project.languages?.languages}
                  >
                    {project.brief}
                  </Project>
                );
              })
            : null}
        </div>
      </main>
    </HydrateClient>
  );
}
