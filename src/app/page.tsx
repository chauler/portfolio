import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import Header from "./_components/Header";
import Project from "./_components/Project";
import { Language } from "~/types/language-icons";

export default async function Home() {
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
              href="resume.pdf"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Resume →</h3>
            </Link>
          </div>
          <Header>Projects</Header>
          <Project
            id={1}
            thumbnail={{ path: "/SDU.png" }}
            title="Subtitle Display Utility"
            ghLink="https://github.com/chauler/Subtitle-Display-Tool"
            languages={[Language.CPP, Language.OPENGL]}
          >
            <p>
              (Under active development) A program intended to ease and
              standardize the creation of subtitles for desktop apps. Your
              application runs our utility and sends it JSON, and we handle the
              rest to display subtitles over your window.
              <br />
              <br />
              Written entirely in C++, using Raylib and OpenGL to render the
              subtitles. Experimentally, can use DLL injection to render
              directly to your program&apos;s framebuffer if you use graphics
              libraries such as DirectX or Vulkan.
            </p>
          </Project>
          <Project
            id={2}
            thumbnail={{ video: true, path: "/algoviz.webm" }}
            title="Algorithm Visualizer"
            ghLink="https://github.com/Kaiyan-Da-Man/algorithm-visualizer"
            languages={[Language.JS]}
          >
            <p>
              An interactive web app allowing users to play with multiple
              algorithms and see how they work under the hood. Features
              pathfinding and sorting algorithms, with smooth and dynamic
              animations to showcase the steps of the algorithm.
              <br />
              <br />
              Written in vanilla JS with minimal libraries. Features scrubbing,
              maze generation, and a responsive canvas that always fills the
              screen pixel-perfect.
            </p>
          </Project>
          <Project
            id={3}
            thumbnail={{ video: true, path: "/spoutshowcase.webm" }}
            title="Spout Effects"
            ghLink="https://github.com/chauler/spout-program"
            languages={[Language.CPP, Language.OPENGL]}
          >
            <div>
              (Under active development) Program which acts as a real-time video
              effects pipeline. Can take a video input from various sources
              (currently webcams and{" "}
              <a
                href="https://spout.zeal.co/"
                className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
              >
                Spout2
              </a>{" "}
              sources), apply post-processing effects (currently limited to an
              ASCII effect), and output the stream through a Spout2 source.
            </div>
          </Project>
        </div>
      </main>
    </HydrateClient>
  );
}
