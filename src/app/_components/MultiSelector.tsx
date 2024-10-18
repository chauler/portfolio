import React from "react";
import {
  type DetailedHTMLProps,
  type SelectHTMLAttributes,
  useEffect,
  useState,
} from "react";

interface Props
  extends Omit<
    DetailedHTMLProps<
      SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    "children"
  > {
  children: {
    value: Options;
    label: string;
    selected?: boolean;
    disabled?: boolean;
  }[];
}

type Options = string | number | readonly string[] | undefined;

function MultiSelector(props: Props) {
  const children = props.children.map((e, i) => {
    return { ...e, value: e.value ?? i };
  });
  const [selected, setSelected] = useState<typeof children>(
    children.filter((e) => e.selected).map((e) => ({ ...e })),
  );
  const [unselected, setUnselected] = useState<typeof children>(
    children.filter((e) => !e.selected).map((e) => ({ ...e })),
  );

  useEffect(() => {
    //Only add the children that are not already selected
    const newlySetSelected = props.children
      .filter(
        (child) =>
          child.selected && !selected.find((e) => e.value === child.value),
      )
      .map((e, i) => ({ ...e, value: e.value ?? i }));

    const newlyUnselected = props.children
      .filter(
        (child) =>
          !child.selected && !unselected.find((e) => e.value === child.value),
      )
      .map((e, i) => ({ ...e, value: e.value ?? i }));

    setSelected([
      ...selected.filter(
        (selectedOption) =>
          !newlyUnselected.find((e) => e.value === selectedOption.value),
      ),
      ...newlySetSelected,
    ]);
    setUnselected([
      ...unselected.filter(
        (unselectedOption) =>
          !newlySetSelected.find((e) => e.value === unselectedOption.value),
      ),
      ...newlyUnselected,
    ]);
  }, [props.children]);

  return (
    <div className="rounded-md border">
      <div
        className={`flex h-fit min-h-12 w-full flex-wrap ${unselected.length > 0 ? "border-b" : ""}`}
      >
        {selected.map((option) => (
          <div
            key={option.value.toString()}
            className="flex gap-2 self-center rounded-md border p-1"
          >
            <div
              data-value={option.value}
              className="rounded-sm px-1 hover:cursor-pointer hover:bg-red-500"
              onClick={(event) => {
                setUnselected([...unselected, option]);
                setSelected(selected.filter((e) => e.value !== option.value));
              }}
            >
              X
            </div>
            {option.label}
          </div>
        ))}
      </div>
      <div>
        {selected.length > 0 ? (
          selected.map((e) => (
            <input
              key={e.value.toString()}
              type="hidden"
              name={props.name}
              value={e.value}
            ></input>
          ))
        ) : (
          <input type="hidden" name={props.name}></input>
        )}
        {unselected.map((option) => (
          <div
            data-value={option.value}
            key={option.value?.toString()}
            className="flex gap-2 hover:cursor-pointer hover:bg-background/10"
            onClick={(event) => {
              setSelected([...selected, option]);
              setUnselected(unselected.filter((e) => e.value !== option.value));
            }}
          >
            <div className="self-center p-1">{option.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(MultiSelector, (oldProps, newProps) => {
  const oldLanguages = oldProps.children;
  const newLanguages = newProps.children;
  if (oldLanguages.length !== newLanguages.length) return false;
  for (let i = 0; i < oldLanguages.length; i++) {
    if (oldLanguages[i]?.value !== newLanguages[i]?.value) {
      return false;
    }
  }
  return true;
});
