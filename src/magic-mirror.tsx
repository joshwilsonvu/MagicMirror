/**
 * This component implements the MagicMirror
 */

import React from 'react';
import * as Core from '@mm/core';

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
function useModulesFromConfig(dynamicConfig: Core.InternalConfig) {
  // same input, same output for each element of the array
  const modules = Core.useMemoArray(dynamicConfig.modules, (m: Core.InternalModuleConfig) => {
    return (
      <MagicMirrorModule {...m} key={m.identifier}/>
    )
  }, []);
  return modules;
}

function MagicMirrorModule({ _component: Component, ...props }: Core.InternalModuleConfig) {
  return props.disabled ? null : (
    <Core.ModuleGuard name={Component.name}>
      <div className={["module", Component.name, ...(props.classes || [])].join(" ")} id={props.identifier}>
        {props.header && <header className="module-header">{props.header}</header>}
        <div className="module-content">
          <Component {...props} />
        </div>
      </div>
    </Core.ModuleGuard>
  );
};

function MagicMirror({ initialConfig }: { initialConfig: Core.Config }) {
  // initialConfig is only initial arg, the component will copy it and manage the copy
  const [config, setConfig] = React.useState(() => Core.initializeConfig(initialConfig));

  const modules = useModulesFromConfig(config);
  return (
    <React.StrictMode>
      <Core.NotificationProvider>
        <Core.ConfigProvider config={config} setConfig={setConfig}>
          <Core.ModuleLayout>
            {modules}
          </Core.ModuleLayout>
        </Core.ConfigProvider>
      </Core.NotificationProvider>
    </React.StrictMode>
  );
}

export default MagicMirror;