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
        <div className="flex flex-col items-center justify-center gap-12 py-16">
          <Header>Hey, I&apos;m Alex.</Header>
          <h2 className="max-w-2xl text-center text-lg font-bold leading-none tracking-tight md:text-2xl">
            I&apos;m Alex Tomjack, a computer science graduate from the
            University of North Texas, currently studying for my master&apos;s
            at the University of Nebraska-Omaha.
          </h2>
          <div className="py-4 sm:py-16"></div>
          <div className="flex w-full flex-col items-center justify-center gap-8 bg-slate-50/[0.05] py-8">
            <Header>Projects</Header>
            {projects
              ? projects.map((project) => {
                  return (
                    <Project
                      key={project.id}
                      id={project.id}
                      thumbnail={project.thumbnailPath}
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
          <div className="py-4 sm:py-16"></div>
          <div className="flex w-full flex-col items-center gap-8 pb-12">
            <Header>My Links</Header>
            <div className="flex flex-col gap-12 sm:flex-row">
              <Link
                className="flex max-w-xs justify-between gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                href="resume.pdf"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">Resume →</h3>
              </Link>
              <Link
                className="flex max-w-xs justify-between gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                href="https://github.com/chauler"
              >
                <h3 className="text-2xl font-bold">Github →</h3>
              </Link>
              <Link
                className="flex max-w-xs justify-between gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                href="https://www.linkedin.com/in/alextomjack/"
              >
                <h3 className="text-2xl font-bold">LinkedIn →</h3>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
