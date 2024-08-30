import { signIn } from "~/auth/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
      className="inline min-w-max rounded-md bg-primary-foreground text-black"
    >
      <button type="submit" className="min-w-48">
        Signin with GitHub
      </button>
    </form>
  );
}
