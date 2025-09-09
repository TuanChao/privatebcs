import React from "react";

export interface NewsContextProps {
  loading?: boolean;
}

export const NewsContext = React.createContext<NewsContextProps>({} as NewsContextProps);
export const NewsContextProvider = NewsContext.Provider;