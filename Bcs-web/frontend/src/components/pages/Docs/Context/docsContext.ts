import React from "react";

export interface DocsContextProps{
    loading?: boolean;
}

export const DocsContext = React.createContext<DocsContextProps>({} as DocsContextProps);
export const DocsContextProvider = DocsContext.Provider;