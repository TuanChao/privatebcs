import React, { ComponentClass, FunctionComponent } from "react";

export interface LayoutProps {
  children?: React.ReactNode;
}

export interface IRouterData {
  path?: string;
  header?: boolean;
  parameter?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  layout?: FunctionComponent<LayoutProps> | ComponentClass<LayoutProps>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  component?: FunctionComponent<{}> | ComponentClass<{}>;
  // children?: IRouterData[];
}
