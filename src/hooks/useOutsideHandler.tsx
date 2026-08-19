import React, { useEffect, useRef } from "react";

function useOutsideHandler(
  ref: React.MutableRefObject<Node | null>,
  closeDropdown?: React.Dispatch<React.SetStateAction<boolean>>,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (closeDropdown) {
          closeDropdown(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, closeDropdown]);
}

export type OutsideHandlerProps = {
  children: JSX.Element;
  closeDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function OutsideHandler(props: OutsideHandlerProps) {
  const wrapperRef = useRef(null);
  useOutsideHandler(wrapperRef, props.closeDropdown);

  return <div ref={wrapperRef}>{props.children}</div>;
}
