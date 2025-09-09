import React from "react";

export interface ServiceContextProps{
    loading?: boolean;
}

export const ServiceContext = React.createContext<ServiceContextProps>({} as ServiceContextProps);
export const ServiceContextProvider = ServiceContext.Provider;