/**
 * This component implements the MagicMirror
 */

import React, { lazy, useReducer } from 'react';
import { nanoid } from 'nanoid';
import path from 'path';
import { NotificationProvider } from '@mm/utils';
import * as Types from './types';

function MMReducer(state, { type, ...payload }) {
  switch (type) {
    case 'HIDE_MODULE':
      return hideModule(true, state, payload);
    case 'SHOW_MODULE':
      return hideModule(false, state, payload);
    default:
      return state;
  }
};

function hideModule(hidden, state, payload) {
  const { identifier, speed } = payload;
  return {
    ...state,
    modules: state.modules.map(m => m.identifier === identifier ? { ...m, hidden, speed } : m),
  };
}


function MMInit({ children, config }) {
  if (children) {
    return {
      modules: React.Children.map(children, child => ({
        hidden: false,

      }))
    }
  }
  return {
    modules: config.modules
      .filter(({ disabled }) => !disabled)
      .map(m => {
        if (typeof m._import !== 'function') {
          throw new Error(`Babel loader not working for ${m.module}.`);
        }
        return m;
      })
      .map(({ module, position, classes = '', header = '', config = {}, _import, _path }) => {
        return {
          hidden: false,
          speed: 1000,
          identifier: `m${nanoid(10)}`, // unique identifier for each module
          Component: _import && lazy(_import), // _import is () => import("module"), done in loader to be statically analyzable
          path: _path && path.dirname(_path),
          file: _path && path.basename(_path),
          name: module,
          position,
          classes,
          header,
          config,
        };
      })
  };
};

// const WrapModule = ({ module }) => {
//   const { Component, hidden, speed, identifier, name, classes, header, config, path, file } = module;
//   let timeout = typeof speed === 'number' ? speed : 1000;
//   const props = { name, path, file, identifier, classNames: classes, header, config, hidden };
//   // add CSSTransition here to apply key and make it a direct child of TransitionGroup
//   return (
//     /*<FadeTransition speed={speed} pose={hidden && "hidden"}>*/
//     <Suspense fallback={<div>...</div>}>
//       <Component {...props} duration={timeout} />
//     </Suspense>
//     /*</FadeTransition>*/
//   );
// };


function MMLayout({ modules }) {
  const {
    none, fullscreen_below, top_bar, top_left, top_center, top_right, upper_third, middle_center,
    lower_third, bottom_bar, bottom_left, bottom_center, bottom_right, fullscreen_above,
  } = getRegions(modules);

  return (
    <>
      <div style={{ display: 'none' }}>{none}</div>
      <div className="region fullscreen below">
        {fullscreen_below}
      </div>
      <div className="region top bar">
        {top_bar}
        <div className="region top left">
          {top_left}
        </div>
        <div className="region top center">
          {top_center}
        </div>
        <div className="region top right">
          {top_right}
        </div>
      </div>
      <div className="region upper third">
        {upper_third}
      </div>
      <div className="region middle center">
        {middle_center}
      </div>
      <div className="region lower third">
        <br />{lower_third}
      </div>
      <div className="region bottom bar">
        {bottom_bar}
        <div className="region bottom left">
          {bottom_left}
        </div>
        <div className="region bottom center">
          {bottom_center}
        </div>
        <div className="region bottom right">
          {bottom_right}
        </div>
      </div>
      <div className="region fullscreen above">
        {fullscreen_above}
      </div>
    </>
  );
}

const defaultRegions: Types.ModulePosition[] = [
  'none',
  'top_bar',
  'top_left',
  'top_center',
  'top_right',
  'upper_third',
  'middle_center',
  'lower_third',
  'bottom_left',
  'bottom_center',
  'bottom_right',
  'bottom_bar',
  'fullscreen_above',
  'fullscreen_below',
];

function getRegions(modules: Types.ModuleState[]) {
  // Divide modules into the various regions by their .position property
  const regions: Partial<Record<Types.ModulePosition, Types.ModuleState[]>> = defaultRegions.reduce((regions, region) => {
    regions[region] = modules.filter(module => !module.disabled && (module.position || 'none') === region);
    return regions;
  }, {});
  return regions;
}

function MagicMirror({ children, config }) {
  // config is only initial arg, changing props doesn't do anything
  const [state] = useReducer(MMReducer, { children, config }, MMInit);

  return (
    <NotificationProvider>
      <MMLayout modules={state.modules} />
    </NotificationProvider>
  );
}

export default MagicMirror;