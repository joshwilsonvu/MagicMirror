/**
 * This component implements the MagicMirror
 */

import React, { Suspense } from 'react';
import { NotificationProvider, useMemoArray } from '@mm/hooks';
import { ModuleGuard, ModuleLayout } from '@mm/components';
import * as Types from '@mm/core';

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
function useModulesFromConfig(dynamicConfig: Types.InternalConfig) {
  // same input, same output for each element of the array
  const modules = useMemoArray(dynamicConfig.modules, (m: Types.InternalModuleConfig) => {
    return (
      <MagicMirrorModule {...m} key={m.identifier}/>
    )
  }, []);
  return modules;
}

function MagicMirrorModule({ _component: Component, ...props }: Types.InternalModuleConfig) {
  return props.disabled ? null : (
    <ModuleGuard name={Component.name}>
      <Suspense fallback={
        <div style={{ width: "100%", height: "100%", backgroundColor: "#933" }}/>
      }>
        <div className={["module", Component.name, ...(props.classes || [])].join(" ")} id={props.identifier}>
          {props.header && <header className="module-header">{props.header}</header>}
          <div className="module-content">
            <Component {...props} />
          </div>
        </div>
      </Suspense>
    </ModuleGuard>
  );
};

function MagicMirror({ initialConfig }: { initialConfig: Types.Config }) {
  // initialConfig is only initial arg, the component will copy it and manage the copy
  const [config, setConfig] = React.useState(() => Types.initializeConfig(initialConfig));

  const modules = useModulesFromConfig(config);
  return (
    <NotificationProvider>
      <ModuleLayout>
        {modules}
      </ModuleLayout>
    </NotificationProvider>
  );
}

export default MagicMirror;