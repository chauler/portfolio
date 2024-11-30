import { Language } from "~/types/language-icons";
import { LanguageIcon } from "~/lib/utils";

export default function SkillsContainer() {
  return (
    <div className="flex h-24 min-h-16 w-full max-w-3xl flex-wrap items-center justify-center gap-4">
      <h2 className="self-center text-3xl font-bold">Skills:</h2>
      {Object.values(Language).map((lang) => {
        if (lang === Language.C) return; //Temporarily remove C due to no icon
        return (
          <LanguageIcon
            lang={lang}
            key={lang}
            className="aspect-square h-12 w-12"
          ></LanguageIcon>
        );
      })}
    </div>
  );
}
