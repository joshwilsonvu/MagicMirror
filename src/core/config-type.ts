import type { BrowserWindowConstructorOptions } from "electron";


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

type Config = Partial<{
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

export default Config;