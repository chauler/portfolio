export interface ProjectData {
  title: string;
  thumbnail: { video?: boolean; path: string };
  brief: string[];
  ghLink: string;
  paragraphs: string[];
  fullSizeDemo: string;
}

export const projectsData: ProjectData[] = [
  {
    title: "Subtitle Display Utility",
    thumbnail: { path: "/SDU.png" },
    brief: [""],
    ghLink: "https://github.com/chauler/Subtitle-Display-Tool",
    paragraphs: [""],
    fullSizeDemo: "",
  },
  {
    title: "Algorithm Visualizer",
    thumbnail: { video: true, path: "/algoviz.webm" },
    brief: [""],
    ghLink: "https://github.com/Kaiyan-Da-Man/algorithm-visualizer",
    paragraphs: [""],
    fullSizeDemo: "",
  },
  {
    title: "Spout Effects",
    thumbnail: { video: true, path: "/spoutshowcase.webm" },
    brief: [""],
    ghLink: "https://github.com/chauler/spout-program",
    paragraphs: [""],
    fullSizeDemo: "",
  },
];
