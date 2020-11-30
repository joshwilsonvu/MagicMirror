/**
 * This component implements the MagicMirror
 */

import React from "react";
import {
  useCurrentConfig,
  useInitializeConfig,
  initializeConfigClient,
  ModuleLayout,
  ModuleGuard,
} from "magicmirror";
import type { Config, ClientModuleConfig } from "./types";

// Use like modifyConfig(hideModule(id, true))
// const MM = {
//   hideModule(identifier, hidden) {
//     return config => {
//       const m = config.modules.find(m => m.identifier === identifier);
//       if (m) {
//         m.hidden = hidden;
//       }
//     }
//   }
// }

/**
 * Modules will control other modules by directly mutating the config object. We
 * can efficiently determine which properties have changed and rerender the
 * module components with the updated properties.
 */

function MagicMirrorModule({
  _component: Component,
  ...props
}: ClientModuleConfig) {
  return props.disabled ? null : (
    <ModuleGuard name={Component.name}>
      <div
        className={["module", Component.name, ...(props.classes || [])].join(
          " "
        )}
        id={props.identifier}
      >
        {props.header && (
          <header className="module-header">{props.header}</header>
        )}
        <div className="module-content">
          <Component {...props} />
        </div>
      </div>
    </ModuleGuard>
  );
}

function MagicMirror({ initialConfig }: { initialConfig: Config }) {
  // initialConfig is only initial arg, the component will copy it and manage the copy
  useInitializeConfig(() => initializeConfigClient(initialConfig));
  const modules = useCurrentConfig(c => c.modules);

  return (
    <React.StrictMode>
      <ModuleLayout>
        {modules.map((m) => (
          <MagicMirrorModule {...m} key={m.identifier} />
        ))}
      </ModuleLayout>
    </React.StrictMode>
  );
}

export default MagicMirror;
