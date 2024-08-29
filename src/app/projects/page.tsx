/* eslint-disable react/jsx-key */
import { HydrateClient } from "~/trpc/server";
import Header from "../_components/Header";
import { SubmitProject } from "../_actions/SubmitProjectAction";
import { MultiUploader } from "../_components/FileUpload";

export default function Projects() {
  return (
    <HydrateClient>
      <main className="flex min-h-full flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Header>Submit a new project</Header>
          <div className="flex w-10/12 flex-col items-center gap-8"></div>
          <form action={SubmitProject}>
            <label htmlFor="Title">Title: </label>
            <input type="text" name="Title" className="text-black"></input>
            <div>
              <br></br>
            </div>
            <label htmlFor="Brief">Brief: </label>
            <textarea
              name="Brief"
              rows={5}
              cols={40}
              className="text-black"
            ></textarea>
            <div>
              <br></br>
            </div>
            <label htmlFor="Languages">Languages: </label>
            <select name="Languages" multiple>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="fiat">Fiat</option>
              <option value="audi">Audi</option>
            </select>
            <div>
              <br></br>
            </div>
            <label htmlFor="Content">Content: </label>
            <input type="file" name="Content"></input>
            <div>
              <br></br>
            </div>
            <label htmlFor="Thumbnail">Thumbnail: </label>
            <input type="file" name="Thumbnail"></input>
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
