import { InfiniteData } from "@tanstack/react-query";
import { ParsedUrlQuery } from "querystring";
import { Dispatch } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

/**
 * Get the URL depending on where you live
 */
export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

type StringKeys<T> = {
  [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];

type OnlyString<T> = { [k in StringKeys<T>]: string };

/**
 * Get the index of an array of object contaning a specific value of an object
 */
export const getIndex = <T extends OnlyString<T>>(
  array: T[],
  key: StringKeys<T>,
  value: string | number,
): number => {
  return array.findIndex((array) => array[key] === value);
};

/**
 * Seperate tailwind utility classes with ease
 */
export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Disable the next button of infinite queries
 */
export const disableNext = (
  data: InfiniteData<unknown> | undefined,
  hasMore: boolean | undefined,
  page: number,
): boolean => {
  if (data) {
    if (data.pages.length === 1) {
      if (hasMore) {
        return false;
      }

      return true;
    }

    if (data.pages.length === page + 1) {
      if (hasMore) {
        return false;
      }

      return true;
    }

    return false;
  }

  return true;
};

/**
 * Check query - Check wether the query exsists
 */
const checkQuery = (query: ParsedUrlQuery): boolean => {
  const isArray = Array.isArray(Object.keys(query));
  if (!isArray) {
    return false;
  }

  const queries = Object.keys(query);
  const values = Object.values(query);
  if (queries.length !== 1 || values.length !== 1 || values[0]) {
    return false;
  }

  return true;
};

/**
 * getQuery - Get the query from the URL parmas
 */
export const getQuery = (query: ParsedUrlQuery) => {
  if (!checkQuery(query)) {
    return null;
  }

  return (<string> Object.keys(query)[0]);
};

const ZodPaths = z.enum(["events", "new"]);
type Paths = z.infer<typeof ZodPaths>;

/**
 * encodePath - Encode the path
 */
export const encodePath = (where: Paths, dst: string): string | null => {
  if (typeof window === "undefined") return null;

  const query = `from=${where}&to=${dst}`;
  const queryEncoded = encodeURIComponent(window.btoa(query));

  return queryEncoded;
};

/**
 * decodePath - Decode the path
 */
export const decodePath = (queryEncoded: string): [page: Paths | null, dst: string | null] => {
  if (typeof window === "undefined") return [null, null];

  try {
    const query = window.atob(decodeURIComponent(queryEncoded));
    const paths: string[] = query.split("&");
    if (paths.length !== 2) {
      return [null, null];
    }

    if (!paths[0] || !paths[1]) {
      return [null, null];
    }

    const wheres = paths[0].split("=");
    const dsts = paths[1].split("=");

    if (wheres.length !== 2 || dsts.length !== 2) {
      return [null, null];
    }

    if (!wheres[1] || !dsts[1]) {
      return [null, null];
    }

    try {
      const where = ZodPaths.parse(wheres[1]);
      const dst = z.string().min(3).max(15).parse(dsts[1]);

      return [where, dst];
    } catch (error) {
      return [null, null];
    }
  } catch (error) {
    console.error(error);
    return [null, null];
  }
};

/**
 * getPreferedURL - Get the user prefered URL
 */
export const getPreferedURL = (where: Paths, dst: string) => {
  switch (where) {
    case "new":
      return `/new`;
    case "events":
      return `/${dst}`;
    default:
      return null;
  }
};
