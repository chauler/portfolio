import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Header from "./_components/Header";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

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
                Project Showcase →
              </h3>
            </Link>
            <Link
              className="flex max-w-xs justify-between gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="./resume"
            >
              <h3 className="text-2xl font-bold">Resume →</h3>
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
