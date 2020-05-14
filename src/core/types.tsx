import React from "react";
import type { BrowserWindowConstructorOptions} from "electron";


export type ModulePosition = 'none' | 'top_bar' | 'top_left' | 'top_center' | 'top_right'
  | 'upper_third' | 'middle_center' | 'lower_third' | 'bottom_left' | 'bottom_center'
  | 'bottom_right' | 'bottom_bar' | 'fullscreen_above' | 'fullscreen_below';

interface ConfigModule {
  module: string;
  position?: ModulePosition;
  classes?: string[];
  header?: string;
  config?: object;
  disabled?: boolean;
}

export type Config = Partial<{
  port: number;
  address: string;
  ipWhitelist: string[];
  zoom: number;
  language: string;
  timeFormat: 12 | 24;
  units: "metric" | "imperial";
  modules: ConfigModule[];
  electronOptions: BrowserWindowConstructorOptions
}>

export type ModuleState = {
  hidden: boolean,
  disabled: boolean,
  identifier: string,
  config: object,
  classes: string[],
  file: string,
  path: string,
  header: string,
  position: ModulePosition,
  Component: React.ComponentType<ModuleProps>
}

export type ModuleProps = ReturnType<typeof filterStateForProps>
function filterStateForProps(state: ModuleState) {
  const { Component, disabled, ...props } = state;
  return props;
}

export type BakedModuleProps = ReturnType<typeof filterStateForBakedComponentProps>
function filterStateForBakedComponentProps({ identifier, file, path, position }: ModuleState) {
  return { identifier, file, path, position };
}
export type DynamicModuleProps = {
  [P in Exclude<keyof ModuleProps, keyof BakedModuleProps>]: ModuleProps[P];
}



export type AdditionalModuleProps = {


}

export function componentize(state: ModuleState) {
  const bakedProps = filterStateForBakedComponentProps(state);
  return (props: DynamicModuleProps) => (
    <state.Component {...bakedProps} {...props} />
  );
}

// type ModuleCompat = ReturnType<typeof filterPropsForCompat>;
// export function filterPropsForCompat({ hidden, identifier, config, classes, file, path, header, position }: ModuleProps) {
//   return {
//     hidden,
//     identifier,
//     config,
//     data: {
//       classes,
//       file,
//       path,
//       header,
//       position,
//     }
//   }
// }
