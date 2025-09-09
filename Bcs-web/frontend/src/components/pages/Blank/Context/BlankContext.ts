import React from "react";

export interface BlankContextProps{}

export const BlankContext = React.createContext<BlankContextProps>({} as BlankContextProps);
export const BlankContextProvider = BlankContext.Provider;