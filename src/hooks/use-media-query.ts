import * as React from "react";

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    const result = matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setValue(event.matches);

    setValue(result.matches);
    result.addEventListener("change", onChange);
    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
