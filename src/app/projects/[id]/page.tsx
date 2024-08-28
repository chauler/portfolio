import Header from "~/app/_components/Header";
import { api, HydrateClient } from "~/trpc/server";
import { ProjectData } from "~/data/projectsData";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
  const project = await api.project.getLatest(Number.parseInt(params.id));
  if (!project) {
    return <></>;
  }
  return (
    <HydrateClient>
      <main className="flex min-h-full flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Header>{project.title}</Header>
          {project.thumbnail.video ? (
            <video
              src={`${project.thumbnail.path}`}
              autoPlay={true}
              controls={false}
              muted={true}
            ></video>
          ) : (
            <Image
              src={`${project.thumbnail.path}`}
              alt="Project showcase picture"
              fill={true}
              className="rounded-xl object-cover"
            ></Image>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
