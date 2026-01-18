import { useState } from "react";
export const useLightbox = (total: number) => {
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => setIndex(i);
  const close = () => setIndex(null);

  const next = () =>
    setIndex((prev) => (prev !== null ? (prev + 1) % total : prev));

  const prev = () =>
    setIndex((prev) => (prev !== null ? (prev - 1 + total) % total : prev));

  return { index, open, close, next, prev };
};
