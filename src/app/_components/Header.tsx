import { Children } from "react";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
      {Children.map(children, (child) => (
        <>{child}</>
      ))}
    </div>
  );
}
