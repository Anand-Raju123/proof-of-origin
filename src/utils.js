import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(page) {
  const pageMap = {
    Home: "/",
    Dashboard: "/dashboard",
    Upload: "/upload",
  };
  return pageMap[page] || "/";
}
