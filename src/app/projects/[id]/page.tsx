import Header from "~/app/_components/Header";
import { api, HydrateClient } from "~/trpc/server";
import Image from "next/image";

/*
TODO: VERIFY IF THUMBNAIL IS AN IMAGE OR VIDEO
*/
export default async function Page({ params }: { params: { id: string } }) {
  const project = await api.project.getProject(Number.parseInt(params.id));
  if (!project) {
    return <></>;
  }
  return (
    <HydrateClient>
      <main className="flex min-h-full flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Header>(Still Under Construction)</Header>
          <Header>{project.title}</Header>
          {project.thumbnailPath ? (
            <video
              src={`${project.thumbnailPath}`}
              autoPlay={true}
              controls={false}
              muted={true}
            ></video>
          ) : (
            <Image
              src={`${project.thumbnailPath}`}
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
