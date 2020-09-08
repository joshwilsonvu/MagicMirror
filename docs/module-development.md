# Module Development in MagicMirror React

If you've used MagicMirror<sup>2</sup>, you've seen and possibly created
some of the hundreds of modules that make it such a popular project.
MagicMirror React was created to make it easier to develop high-quality
modules and share them with the world.

## Starting a module

So you have an idea for a useful MagicMirror module. Great! To get
started, run

```sh
yarn mm init NewModule  # replace with the name of your module
```

See `yarn mm init --help` for more details. Then open
MagicMirror/modules/MMM-NewModule/index.js. You'll see the following
content:

```javascript
import React, { useState } from "react";
import {
  useNotification,
  sendNotification,
  useSocketNotification,
  sendSocketNotification,
  useFetchJson,
} from "@mm/core";

// This object contains default values for the module configuration.
const defaults = {
  // option: "default value"
};

export default function NewModule(props) {
  // Get the module configuration by combining defaults with props.config.
  const config = { ...defaults, ...props.config };

  // Props has other useful properties from the MagicMirror config file.
  const {
    name,
    identifier,
    position,
    classes,
    hidden,
    file,
    path,
    header,
  } = props;

  // Return HTML (React elements), using curly brackets to include JavaScript expressions.
  return (
    <div>
      Edit <pre>{file}</pre> in <pre>{path}</pre> to get started with your new
      module.
    </div>
  );
}

// See the docs for more information.
```

## Migrating from MagicMirror<sup>2</sup>
