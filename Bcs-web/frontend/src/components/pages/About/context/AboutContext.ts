import React from "react";

export interface AboutContextProps {
  loading?: boolean;
}

export const AboutContext = React.createContext<AboutContextProps>({} as AboutContextProps);
export const AboutContextProvider = AboutContext.Provider;
