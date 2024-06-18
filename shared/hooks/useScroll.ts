import { useLayoutEffect, useState } from "react";

export const useScroll = () => {
  const [state, setState] = useState({ x: 0, y: 0, perX: 0, perY: 0 });

  useLayoutEffect(() => {
    const handleScroll = () => {
      setState({
        x: window.scrollX,
        y: window.scrollY,
        perX: Math.round((window.scrollX / window.innerWidth) * 100),
        perY: Math.round((window.scrollY / window.innerHeight) * 100),
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);
  return [state];
}