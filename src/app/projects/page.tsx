"use server";
/* eslint-disable react/jsx-key */
import { HydrateClient } from "~/trpc/server";
import Header from "../_components/Header";
import { SubmitProject } from "../_actions/SubmitProjectAction";
import { MultiUploader } from "../_components/FileUpload";
import { Language } from "~/types/language-icons";

export default async function Projects() {
  // const session = await auth();

  // if (!session || session.user?.email !== "amt1309@gmail.com")
  //   return (
  //     <>
  //       <SignIn></SignIn>
  //       <div className="text-white">Not Authenticated - Administrator only</div>
  //     </>
  //   );

  return (
    <HydrateClient>
      <main className="flex min-h-full flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Header>Submit a new project</Header>
          <div className="flex w-10/12 flex-col items-center gap-8"></div>
          <form action={SubmitProject}>
            <label htmlFor="Title">Title: </label>
            <input
              type="text"
              name="Title"
              required={true}
              className="text-black"
            ></input>
            <div>
              <br></br>
            </div>
            <label htmlFor="Brief">Brief: </label>
            <textarea
              name="Brief"
              rows={5}
              cols={40}
              required={true}
              className="text-black"
            ></textarea>
            <div>
              <br></br>
            </div>
            <label htmlFor="ghLink">Repo Link: </label>
            <input type="text" name="ghLink" className="text-black"></input>
            <div>
              <br></br>
            </div>
            <label htmlFor="Languages">Languages: </label>
            <select name="Languages" multiple className="text-black">
              <option value={Language.CPP}>CPP</option>
              <option value={Language.JS}>JS</option>
              <option value={Language.OPENGL}>OpenGL</option>
              <option value={Language.C}>C</option>
            </select>
            <div>
              <br></br>
            </div>
            <label htmlFor="Content">Content: </label>
            <input type="file" name="Content" required={true}></input>
            <div>
              <br></br>
            </div>
            <label htmlFor="Thumbnail">Thumbnail: </label>
            <input type="file" name="Thumbnail" required={true}></input>
            <div>
              <br></br>
            </div>
            <button type="submit" name="submit">
              Submit
            </button>
          </form>
          <MultiUploader></MultiUploader>
        </div>
      </main>
    </HydrateClient>
  );
}
