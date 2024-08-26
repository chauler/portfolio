/* eslint-disable react/jsx-key */
import { HydrateClient } from "~/trpc/server";
import Header from "../_components/Header";
import Project from "../_components/Project";
import { Language } from "~/types/language-icons";

export default async function Projects() {
  return (
    <HydrateClient>
      <main className="flex min-h-full flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Header>My Projects</Header>
          <div className="flex w-10/12 flex-col items-center gap-8">
            <Project
              thumbnailPath="/algoviz1.png"
              title="Subtitle Display Utility"
              ghLink="https://github.com/chauler/Subtitle-Display-Tool"
              languages={[Language.CPP, Language.OPENGL]}
            >
              A program which eases and standardizes the creation of subtitles
              for desktop apps.
            </Project>
            <Project
              thumbnailPath="/algoviz1.png"
              title="Algorithm Visualizer"
              ghLink="https://github.com/Kaiyan-Da-Man/algorithm-visualizer"
              languages={[Language.JS]}
            >
              An interactive web app that allows users to play around with
              multiple algorithms and see how they work in-depth.
            </Project>
            <Project
              thumbnailPath="/algoviz1.png"
              title="Spout Effects"
              ghLink="https://github.com/chauler/spout-program"
              languages={[Language.CPP, Language.OPENGL]}
            >
              <div>
                Program which acts as a real-time video effects pipeline. Can
                take a video input from various sources (currently webcams and{" "}
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
        </div>
      </main>
    </HydrateClient>
  );
}
