import React from "react";
import path from "path";
import { nanoid } from "nanoid";

/**
 * A module may appear in any of these positions on screen.
 */
export type ModulePosition = 'none' | 'top_bar' | 'top_left' | 'top_center' | 'top_right'
  | 'upper_third' | 'middle_center' | 'lower_third' | 'bottom_left' | 'bottom_center'
  | 'bottom_right' | 'bottom_bar' | 'fullscreen_above' | 'fullscreen_below';

/**
 * Options for each module. While only `module` is strictly required, some modules
 * may also require `position` and/or `config`.
 */
export type ModuleConfig = {
  module: string;
  position?: ModulePosition;
  classes?: string[];
  header?: string;
  config?: Record<string, any>;
  disabled?: boolean;
  // Note: the rest of these properties are automatically added but won't be typechecked
  _component?: React.ComponentType<ComponentProps>;
  _path?: string; // the relative path from config file to module file
}

export type InternalModuleConfig = ModuleConfig & {
  hidden: boolean;
  identifier: string;
  file: string; // the module file
  path: string; // the directory containing the module file
};

export type ComponentProps = Omit<InternalModuleConfig, "header" | "classes" | "_component">;


/**
 * Options for MagicMirror.
 */
export type Config = {
  port?: number;
  address?: string;
  ipWhitelist?: string[];
  zoom?: number;
  language?: string;
  timeFormat?: 12 | 24;
  units?: "metric" | "imperial";
  useHttps?: boolean;
  // if useHttps is true but either of the next two properties are undefined, they will be generated
  httpsPrivateKey?: string;
  httpsCertificate?: string;
  modules?: ModuleConfig[];
  electronOptions?: BrowserWindowConstructorOptions;
  // Note: the rest of these properties are automatically added but won't be typechecked
  __dirname?: string; // the location of the config file
}

export type InternalConfig = Omit<Config, "modules"> & {
  modules: InternalModuleConfig[];
}

export function initializeConfig({modules, ...rest}: Config): InternalConfig {
  return {
    ...rest,
    modules: modules.map(initializeModule),
  }
}

export function initializeModule(mod: ModuleConfig): InternalModuleConfig {
  if (!mod._path || !mod._component) {
    throw new Error(`Babel loader not working for module ${mod.module}: ${JSON.stringify(mod)}.`);
  }
  const f = path.basename(mod._path), p = path.dirname(mod._path);
  return {
    ...mod,
    hidden: false,
    identifier: `m${nanoid(10)}`,
    file: f,
    path: p
  }
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


/**
 * These options modify Electron's behavior. Certain platform-specific options have been
 * removed to avoid confusion.
 */
interface BrowserWindowConstructorOptions {
  /**
   * Window's width in pixels. Default is `800`.
   */
  width?: number;
  /**
   * Window's height in pixels. Default is `600`.
   */
  height?: number;
  /**
   * (**required** if y is used) Window's left offset from screen. Default is to
   * center the window.
   */
  x?: number;
  /**
   * (**required** if x is used) Window's top offset from screen. Default is to
   * center the window.
   */
  y?: number;
  /**
   * The `width` and `height` would be used as web page's size, which means the
   * actual window's size will include window frame's size and be slightly larger.
   * Default is `false`.
   */
  useContentSize?: boolean;
  /**
   * Show window in the center of the screen.
   */
  center?: boolean;
  /**
   * Window's minimum width. Default is `0`.
   */
  minWidth?: number;
  /**
   * Window's minimum height. Default is `0`.
   */
  minHeight?: number;
  /**
   * Window's maximum width. Default is no limit.
   */
  maxWidth?: number;
  /**
   * Window's maximum height. Default is no limit.
   */
  maxHeight?: number;
  /**
   * Whether window is resizable. Default is `true`.
   */
  resizable?: boolean;
  /**
   * Whether the window can be focused. Default is `true`. On Windows setting
   * `focusable: false` also implies setting `skipTaskbar: true`. On Linux setting
   * `focusable: false` makes the window stop interacting with wm, so the window will
   * always stay on top in all workspaces.
   */
  focusable?: boolean;
  /**
   * Whether the window should always stay on top of other windows. Default is
   * `false`.
   */
  alwaysOnTop?: boolean;
  /**
   * Whether the window should show in fullscreen. When explicitly set to `false` the
   * fullscreen button will be hidden or disabled on macOS. Default is `false`.
   */
  fullscreen?: boolean;
  /**
   * Whether the window can be put into fullscreen mode. On macOS, also whether the
   * maximize/zoom button should toggle full screen mode or maximize window. Default
   * is `true`.
   */
  fullscreenable?: boolean;
  /**
   * Whether to show the window in taskbar. Default is `false`.
   */
  skipTaskbar?: boolean;
  /**
   * Whether the window is in kiosk mode. Default is `false`.
   */
  kiosk?: boolean;
  /**
   * Default window title. Default is `"Electron"`. If the HTML tag `<title>` is
   * defined in the HTML file loaded by `loadURL()`, this property will be ignored.
   */
  title?: string;
  /**
   * The window icon. On Windows it is recommended to use `ICO` icons to get best
   * visual effects, you can also leave it undefined so the executable's icon will be
   * used.
   */
  icon?: string;
  /**
   * Whether window should be shown when created. Default is `true`.
   */
  show?: boolean;
  /**
   * Whether the renderer should be active when `show` is `false` and it has just
   * been created.  In order for `document.visibilityState` to work correctly on
   * first load with `show: false` you should set this to `false`.  Setting this to
   * `false` will cause the `ready-to-show` event to not fire.  Default is `true`.
   */
  paintWhenInitiallyHidden?: boolean;
  /**
   * Specify `false` to create a Frameless Window. Default is `true`.
   */
  frame?: boolean;
  /**
   * Whether the web view accepts a single mouse-down event that simultaneously
   * activates the window. Default is `false`.
   */
  acceptFirstMouse?: boolean;
  /**
   * Whether to hide cursor when typing. Default is `false`.
   */
  disableAutoHideCursor?: boolean;
  /**
   * Auto hide the menu bar unless the `Alt` key is pressed. Default is `false`.
   */
  autoHideMenuBar?: boolean;
  /**
   * Window's background color as a hexadecimal value, like `#66CD00` or `#FFF` or
   * `#80FFFFFF` (alpha in #AARRGGBB format is supported if `transparent` is set to
   * `true`). Default is `#FFF` (white).
   */
  backgroundColor?: string;
  /**
   * Whether window should have a shadow. Default is `true`.
   */
  hasShadow?: boolean;
  /**
   * Forces using dark theme for the window, only works on some GTK desktop
   * environments. Default is `false`.
   */
  darkTheme?: boolean;
  /**
   * Makes the window transparent. Default is `false`. On Windows, does not work
   * unless the window is frameless.
   */
  transparent?: boolean;
  /**
   * The type of window, default is normal window. See more about this below.
   */
  type?: string;
  /**
   * The style of window title bar. Default is `default`. Possible values are:
   */
  titleBarStyle?: ('default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover');
  /**
   * Settings of web page's features.
   */
  webPreferences?: WebPreferences;
}

/**
 * These options modify the browser's behavior.
 */
interface WebPreferences {
  /**
   * Whether to enable DevTools. If it is set to `false`, can not use
   * `BrowserWindow.webContents.openDevTools()` to open DevTools. Default is `true`.
   */
  devTools?: boolean;
  /**
   * Whether node integration is enabled. Default is `false`.
   */
  nodeIntegration?: boolean;
  /**
   * Whether node integration is enabled in web workers. Default is `false`. More
   * about this can be found in Multithreading.
   */
  nodeIntegrationInWorker?: boolean;
  /**
   * Experimental option for enabling Node.js support in sub-frames such as iframes
   * and child windows. All your preloads will load for every iframe, you can use
   * `process.isMainFrame` to determine if you are in the main frame or not.
   */
  nodeIntegrationInSubFrames?: boolean;
  /**
   * Specifies a script that will be loaded before other scripts run in the page.
   * This script will always have access to node APIs no matter whether node
   * integration is turned on or off. The value should be the absolute file path to
   * the script. When node integration is turned off, the preload script can
   * reintroduce Node global symbols back to the global scope. See example here.
   */
  preload?: string;
  /**
   * If set, this will sandbox the renderer associated with the window, making it
   * compatible with the Chromium OS-level sandbox and disabling the Node.js engine.
   * This is not the same as the `nodeIntegration` option and the APIs available to
   * the preload script are more limited. Read more about the option here.
   */
  sandbox?: boolean;
  /**
   * Whether to enable the `remote` module. Default is `true`.
   */
  enableRemoteModule?: boolean;
  /**
   * The default zoom factor of the page, `3.0` represents `300%`. Default is `1.0`.
   */
  zoomFactor?: number;
  /**
   * Enables JavaScript support. Default is `true`.
   */
  javascript?: boolean;
  /**
   * When `false`, it will disable the same-origin policy (usually using testing
   * websites by people), and set `allowRunningInsecureContent` to `true` if this
   * options has not been set by user. Default is `true`.
   */
  webSecurity?: boolean;
  /**
   * Allow an https page to run JavaScript, CSS or plugins from http URLs. Default is
   * `false`.
   */
  allowRunningInsecureContent?: boolean;
  /**
   * Enables image support. Default is `true`.
   */
  images?: boolean;
  /**
   * Make TextArea elements resizable. Default is `true`.
   */
  textAreasAreResizable?: boolean;
  /**
   * Enables WebGL support. Default is `true`.
   */
  webgl?: boolean;
  /**
   * Whether plugins should be enabled. Default is `false`.
   */
  plugins?: boolean;
  /**
   * Enables Chromium's experimental features. Default is `false`.
   */
  experimentalFeatures?: boolean;
  /**
   * A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey`
   * to enable. The full list of supported feature strings can be found in the
   * RuntimeEnabledFeatures.json5 file.
   */
  enableBlinkFeatures?: string;
  /**
   * A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey`
   * to disable. The full list of supported feature strings can be found in the
   * RuntimeEnabledFeatures.json5 file.
   */
  disableBlinkFeatures?: string;
  /**
   * Defaults to `16`.
   */
  defaultFontSize?: number;
  /**
   * Defaults to `13`.
   */
  defaultMonospaceFontSize?: number;
  /**
   * Defaults to `0`.
   */
  minimumFontSize?: number;
  /**
   * Defaults to `ISO-8859-1`.
   */
  defaultEncoding?: string;
  /**
   * Whether to throttle animations and timers when the page becomes background. This
   * also affects the Page Visibility API. Defaults to `true`.
   */
  backgroundThrottling?: boolean;
  /**
   * Whether to enable offscreen rendering for the browser window. Defaults to
   * `false`. See the offscreen rendering tutorial for more details.
   */
  offscreen?: boolean;
  /**
   * Whether to run Electron APIs and the specified `preload` script in a separate
   * JavaScript context. Defaults to `false`. The context that the `preload` script
   * runs in will still have full access to the `document` and `window` globals but
   * it will use its own set of JavaScript builtins (`Array`, `Object`, `JSON`, etc.)
   * and will be isolated from any changes made to the global environment by the
   * loaded page. The Electron API will only be available in the `preload` script and
   * not the loaded page. This option should be used when loading potentially
   * untrusted remote content to ensure the loaded content cannot tamper with the
   * `preload` script and any Electron APIs being used. This option uses the same
   * technique used by Chrome Content Scripts. You can access this context in the dev
   * tools by selecting the 'Electron Isolated Context' entry in the combo box at the
   * top of the Console tab.
   */
  contextIsolation?: boolean;
  /**
   * Whether to use native `window.open()`. Defaults to `false`. Child windows will
   * always have node integration disabled unless `nodeIntegrationInSubFrames` is
   * true. **Note:** This option is currently experimental.
   */
  nativeWindowOpen?: boolean;
  /**
   * Whether to enable the `<webview>` tag. Defaults to `false`. **Note:** The
   * `preload` script configured for the `<webview>` will have node integration
   * enabled when it is executed so you should ensure remote/untrusted content is not
   * able to create a `<webview>` tag with a possibly malicious `preload` script. You
   * can use the `will-attach-webview` event on webContents to strip away the
   * `preload` script and to validate or alter the `<webview>`'s initial settings.
   */
  webviewTag?: boolean;
  /**
   * A list of strings that will be appended to `process.argv` in the renderer
   * process of this app.  Useful for passing small bits of data down to renderer
   * process preload scripts.
   */
  additionalArguments?: string[];
  /**
   * Whether to enable browser style consecutive dialog protection. Default is
   * `false`.
   */
  safeDialogs?: boolean;
  /**
   * The message to display when consecutive dialog protection is triggered. If not
   * defined the default message would be used, note that currently the default
   * message is in English and not localized.
   */
  safeDialogsMessage?: string;
  /**
   * Whether to disable dialogs completely. Overrides `safeDialogs`. Default is
   * `false`.
   */
  disableDialogs?: boolean;
  /**
   * Whether dragging and dropping a file or link onto the page causes a navigation.
   * Default is `false`.
   */
  navigateOnDragDrop?: boolean;
  /**
   * Autoplay policy to apply to content in the window, can be
   * `no-user-gesture-required`, `user-gesture-required`,
   * `document-user-activation-required`. Defaults to `no-user-gesture-required`.
   */
  autoplayPolicy?: ('no-user-gesture-required' | 'user-gesture-required' | 'document-user-activation-required');
  /**
   * Whether to prevent the window from resizing when entering HTML Fullscreen.
   * Default is `false`.
   */
  disableHtmlFullscreenWindowResize?: boolean;
  /**
   * An alternative title string provided only to accessibility tools such as screen
   * readers. This string is not directly visible to users.
   */
  accessibleTitle?: string;
  /**
   * Whether to enable the builtin spellchecker. Default is `true`.
   */
  spellcheck?: boolean;
}