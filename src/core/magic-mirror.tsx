/**
 * This component implements the MagicMirror
 */

import React, { useReducer, Suspense } from 'react';
import path from 'path';
import { NotificationProvider, useMemoArray } from '@mm/hooks';
import { ModuleGuard, ModuleLayout } from '@mm/components';
import * as Types from './types';
import produce from 'immer';

// Use like modifyConfig(hideModule(id, true))
function hideModule(identifier, hidden) {
  return config => {
    const mIndex = config.modules.findIndex(m => m.identifier === identifier);
    if (mIndex !== -1) {
      config[mIndex].hidden = hidden;
    }
  }
}


function useChildren(children) {
  if (children) {
    return {
      modules: React.Children.map(children, child => ({
        hidden: false,

      }))
    }
  }

};

/**
 * Modules will control other modules by directly mutating the config object. Thanks to
 * immer, we can efficiently determine which properties have changed and rerender the
 * module components with the updated properties.
 */
function useConfig(dynamicConfig: Types.InternalConfig) {
  // same input, same output for each element of the array
  const modules = useMemoArray(dynamicConfig.modules, (m: Types.InternalModuleConfig) => {
    return (
      <MagicMirrorModule {...m} key={m.identifier}/>
    )
  }, []);
  return {
    ...dynamicConfig,
    modules
  };
}

const MagicMirrorModule = ({classes, header, _component: Component, ...props}: Types.InternalModuleConfig) => {
  return props.disabled ? null : (
    <ModuleGuard name={Component.name}>
      <Suspense fallback={
        <div style={{ width: "100%", height: "100%", backgroundColor: "#933" }}/>
      }>
        <div className={["module", Component.name, ...(classes || [])].join(" ")} id={props.identifier}>
          {header && <header className="module-header">{header}</header>}
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
  const [config, modifyConfig] = useReducer((conf: Types.InternalConfig, modify: (conf: Types.InternalConfig) => void) => produce(conf, modify),
    initialConfig, Types.initializeConfig);

  const {modules} = useConfig(config);
  return (
    <NotificationProvider>
      <ModuleLayout>
        {modules}
      </ModuleLayout>
    </NotificationProvider>
  );
}

export default MagicMirror;