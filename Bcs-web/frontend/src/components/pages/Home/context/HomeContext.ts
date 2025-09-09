import React from "react";
import { HomeKOLs } from "../Home.type";
import { HomeNewsData } from "../Home.type";

export interface HomeContextProps {
  listKol: HomeKOLs[][];
  scrollPosition: number;
  listNews: HomeNewsData[][];
}

export const HomeContext = React.createContext<HomeContextProps>({} as HomeContextProps);
export const HomeContextProvider = HomeContext.Provider;

