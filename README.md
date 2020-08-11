# MagicMirror React

> Note: MagicMirror React is currently in alpha status.
> A beta version will be released soon, and a stable version
> will follow.

**MagicMirror React** is an fork of
[MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror),
the leading open-source smart mirror platform. MagicMirror React comes
with modern development features that make modules more powerful
and less challenging to develop.

## Features

MagicMirror React uses tools from modern web development to
make many powerful features possible.

- **Live Reloading:** When changes to files are made (including the
  config file), the screen will instantly update. No need to stop
  and restart.

- **Extra Performance:** MagicMirror modules automatically load faster.

- **Better Reliability:** Modules run independently, so
  problems in one won't affect others.

- **Backwards Compatibility:** Even though MagicMirror React is a
  full rewrite of MagicMirror<sup>2</sup>, it aims to be fully
  backwards compatible with existing configuration files
  and third party modules.

  > Note: backwards compatibility for modules isn't ready yet. Check back
  > when a beta version is out.

Many of the new features are for module development. They won't impact
users directly, but they do make it easier for users to become contributors.

- **Dependencies:** Each MagicMirror module can independently use npm
  packages with `yarn add <package>`. They will still work if your computer
  is offline.

- **ES6+ Syntax:** `import` and `export` make code easier to understand
  than using global variables, and all of the latest syntax is available.

* **React:** As the name implies, modules will now use
  [React](https://reactjs.org/) to display content to the screen. React
  makes it much easier to display complex and interactive content. See
  the [helloworld](./modules/default/helloworld/helloworld.js) module
  for an example.

  The React [**tutorial**](./docs/react.md) can get you started
  quickly. It's recommended reading for aspiring module developers.

* **CSS Imports and CSS-in-JS:** Use `import "./my.css"` from JavaScript
  to use a CSS file.

  [SASS](https://sass-lang.com/) and all CSS-in-JS libraries such as
  [Emotion](https://emotion.sh) are supported for flexibility of styling.

* **Linting:** Your code is checked for potential problems, which improves
  the quality of your code and reduces bugs. Opt in with `--check`.

* **TypeScript:** TypeScript, a typed superset of JavaScript,
  is supported. Like linting, TypeScript can help catch bugs. Change your
  `.js` files to `.tsx`, and any type errors will be detected. Opt in with `--check`.

_"Hang on, I don't see the code to do all of that in this repository!
And what are `@mm/core`, `@mm/cli`, and the other `@mm` packages in
`package.json`?"_

The above features do require some complexity to implement, and they would
clutter up this repository. So, the code is bundled up into packages
that Yarn downloads, and your JavaScript `import`s. You can find them all in
[the `mm` repository](https://github.com/joshwilsonvu/mm/tree/master/packages).

`@mm/core` and `@mm/cli` are the only ones you should normally worry about.
The core has React components, React hooks, and utilities that MagicMirror
modules will use. The CLI is responsible for bundling up, serving, and
running your mirror; run it with `yarn mm`. The other packages mostly
relate to backwards compatibility. Documentation is coming soon.

## Installation

MagicMirror React requires Node.js >= 12.x and Yarn. On a Raspberry Pi,
open a terminal and run the following commands (you may be prompted
for your login password):

```sh
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update
sudo apt install nodejs yarn
```

Test that Node.js and Yarn are installed by running

```sh
node --version
yarn --version
```

This should display something like `v12.0.0` and `1.22.0`.

Download MagicMirror into the current directory by running the following.
Make sure to use `yarn` instead of `npm`. It may take several minutes.

```sh
git clone --depth=1 https://github.com/joshwilsonvu/MagicMirror.git
cd MagicMirror
yarn install
```

## Running MagicMirror React

Start up your MagicMirror by running `yarn mm start`. A window will
appear with a default set of modules, which you can change by editing
`config/config.js`. When changes are made, the screen will live reload
without having to stop and restart.

Check the output of `yarn mm --help` for other things MagicMirror React
can do.

---

Does this page need improvement? [File an issue](https://github.com/joshwilsonvu/MagicMirror/issues/new)
and help us improve.
