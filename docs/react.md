# Introduction to React

[**React**](https://reactjs.org) is a JavaScript library for
building user interfaces. It allows you to create complex applications
from small, independent pieces.

> This tutorial assumes that you're somewhat familiar with JavaScript
> (JS) and HTML, but you don't have to be an expert. There are many
> free online resources for learning basic web development, and any
> prior programming knowledge helps.
>
> None of this material is specific to MagicMirror. React is popular
> in professional web development, and the skills you learn here will
> transfer to "real-world" applications.

## Why React?

Without React (or other libraries), adding interactive content to websites
is **imperative**; you must specify **how** and **when** to make changes
to the screen.

For example, imagine adding an image and a caption to `document.body`
on the fly. Here's roughly the HTML we want:

```html
<html>
  <body>
    <div>
      <img src="https://example.org/a/nice/image" />
      <p>This is a nice image.</p>
    </div>
  </body>
</html>
```

And here's the JavaScript code to add those HTML elements. Notice how
each element is explicitly created and added to the DOM, one by one.

```javascript
const image = document.createElement("img");
image.src = "https://example.org/a/nice/image";

const caption = document.createElement("p");
caption.append("This is a nice image.");

const container = document.createElement("div");
container.append(image);
container.append(caption);
document.body.append(container);
```

React is **declarative**. It takes care of changing the DOM, so you only
need to say **what** you want on the screen at any given time. React uses
a syntax called JSX that looks like HTML inside of JavaScript code.

```javascript
const elements = (
  <div>
    <img src="https://example.org/a/nice/image">
    <p>This is a nice image.</p>
  </div>
);
ReactDOM.render(elements, document.body);
```

## React Elements

Note how similar the example above looks to the desired HTML markup.
However, these elements are not real DOM elements; they are
**React elements**, JavaScript objects that represent the markup you
want to see on the screen.

React is smart about how it updates the DOM. If you were to call `ReactDOM.render`
again, it would inspect the new React elements and only update DOM elements
that need to be changed, if any. This is much faster than throwing away a
tree of DOM elements and starting from scratch.

> Here's the official [React docs](https://reactjs.org/docs/introducing-jsx.html)
> page on JSX and React elements.

## Components

Most user interfaces are larger than the snippet above, so it is useful to
break them into smaller, independent pieces called **components**.
Components are JavaScript functions that return React elements. Let's
turn the example above into a component called "Picture". Any name that
starts with an uppercase letter would work.

```javascript
function Picture() {
  return (
    <div>
      <img src="https://example.org/a/nice/image">
      <p>This is a nice image.</p>
    </div>
  );
}
ReactDOM.render(<Picture />);
```

Instead of rendering ordinary HTML tags, we render the component we just
defined by putting the name of the function in angle brackets. The final
output is the same.

Now, we can reuse the `Picture` component by putting it inside of other
markup as an element, just like you would use a `div` or a `p` element.
But right now, it would always render the same image and caption.

## Props

Components can accept a **props** object as an argument. It contains
any properties given in the markup. Components can customize their output
depending on the values of the props.

Let's have the `Picture` component render an arbitrary image url and
description. We can wrap JavaScript expressions in curly braces to use
them inside JSX.

```javascript
function Picture(props) {
  return (
    <div>
      <img src={props.imageUrl}>
      <p>This is {props.description}</p>
    </div>
  );
}
ReactDOM.render(
  <Picture imageUrl="https://example.org/a/better/image" description="a better image!"/>
);
```

In this example, `props` is
`{ imageUrl: "https://example.org/a/better/image", description: "a better image!" }`.
But `props` can be whatever you would like your component to accept.

Props can change over time, and React will automatically rerender your
component when this happens.

Props are read-only, so do not try to modify the `props` object in
your components.

## The `children` Prop

Many HTML elements like `div` contain other elements. React components can
contain other elements too; these elements are passed as `props.children`.
This is often useful for layout, like adding a header and footer.

```javascript
function Layout(props) {
  return (
    <div>
      <header>This is my header content.</header>
      {props.children}
      <footer>This is my footer content.</footer>
    </div>
  );
}
ReactDOM.render(
  <Layout>
    <Picture
      imageUrl="https://example.org/a/better/image"
      description="a better image!"
    />
  </Layout>
);
```

> Here's the official [React docs](https://reactjs.org/docs/components-and-props.html)
> page on components and props.

---

By now, you've learned how to render markup with React, and you're ready
to start your first MagicMirror module (which is just a component!). Run
`yarn mm init --help` from the command line to get started.

Read on to learn how to add lists, styling, and state.

---

## Lists

Many times, we want to display a list, or array, of data. We can do this
by [mapping](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) our data to React elements.

For example, given a list of family members, let's greet each one
individually. First, let's write a component to give a custom greeting
to a given name, as `props.greeting` and `props.name`.

```javascript
function Greeting(props) {
  return (
    <div>
      {props.greeting}, {props.name}!
    </div>
  );
}

// Possible usage:
ReactDOM.render(<Greeting greeting="Good morning" name="Elizabeth" />);
// Good morning, Elizabeth!
```

Then, let's write a component to greet a list of names with one greeting,
as `props.greeting` and `props.names`. We want to use one `<Greeting/>`
element for each individual. To do this, we map the list of
names into list items (`<li></li>`) containing one `<Greeting/>` element
each, and give each `<li>` a special, unique prop called `key`.

```javascript
function FamilyGreeting(props) {
  const listItems = props.names.map((name) => (
    <li key={name}>
      <Greeting greeting={props.greeting} name={name} />
    </li>
  ));
  // listItems is an array of React elements with
  // unique key props.
  return <ul>{listItems}</ul>;
}
```

React requires each element in a list to have a unique `key` prop, which
can be whatever primitive value you might have that identifies each list
item. Without a `key`, it becomes much more difficult to handle insertions,
deletions, and reorderings of the list items. A `key` prop tells React
which items are conceptually "the same" across renders. Don't worry if
you're not totally sure when to use a `key`; React will let you know if
a `key` is missing in the browser development tools.

## Styling

There are a few good ways to add CSS styles to your JSX.

### The `className` Prop

The simplest way to add styles to built-in elements
is with the `className` prop. Notice that it isn't `class`, like it is in
HTML. (`class` is a special keyword in JavaScript.)

To make your CSS styles available, you must `import` the CSS (or SASS) file
from the JavaScript file as shown below. This also makes the styles
available to any other component, so make sure that the class names you
use won't collide with names defined by others. This replaces the
`getStyles()` function in MagicMirror<sup>2</sup>.

```css
/* my-styles.css */
.mycomponent-bright {
  color: white;
}
.mycomponent-big {
  font-size: 3rem;
}
```

```javascript
/* mycomponent.js */
import "./my-styles.css";

function MyComponent() {
  return (
    <div className="mycomponent-bright mycomponent-big">Hello, world!</div>
  );
}
```

### The `style` Prop

You may be aware that in HTML, you can add one-off styles to a single
element with the `style` attribute. In React, you can write one-off styles
with the `style` prop by passing an object containing the styles.

Using two pairs of curly braces may look different from what we've seen
before, but it's actually consistent: the outer pair embeds a JavaScript
expression into the JSX, while the inner pair defines an object literal.

Unlike the `className` prop, the `style` prop lets you pass in JavaScript
values to control the styling. For example, we can take the color from
`props.color`, with a sensible default if `props.color` is not provided:

```javascript
function MyComponent(props) {
  return (
    <div
      style={{
        color: props.color || "white",
        fontSize: "3rem",
      }}
    >
      Hello, world!
    </div>
  );
}
```

### CSS-in-JS

`className` and `style` can cover many styling use cases. However,
there are libraries that provide fast and ergonomic ways to do more
advanced styling within JavaScript.

If you're feeling adventurous, check out [Emotion](https://emotion.sh)
or [styled components](https://styled-components.com/), two CSS-in-JS
libraries used by many prominent websites.

## State

Up to this point, components have just been able to display content based
on props. There has been no discussion about how content can change over
time. React provides the concept of **state** to handle this. Unlike
normal variables, which disappear when the function returns, components
remember state from previous renders.

Remember, the point of using React is to describe **what** your view should
look like at any given time, without worrying about **how** and **when**
to update the DOM. You can use state to represent data that changes over
time, and React will update the DOM for you when your state changes.
(There is no manual `updateDOM` function, like there is in
MagicMirror<sup>2</sup>.)

To illustrate, imagine you want to render a button and a paragraph showing
how many times the button has been clicked. To accomplish this, we define
a new state called `count`, and set the button's `onClick` handler to
increment `count` by one. Each time the button is clicked, the paragraph
updates with a new number of clicks.

```javascript
import React, { useState } from "react";

function Counter() {
  // Declare count and setCount, and
  // initialize count to 0 on the first render.
  const [count, setCount] = useState(0);
  // Display count to the screen, and set up an
  // action to happen when the button is clicked.
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

React provides a function `useState` that allows you to hook into React's
state features from within a component. `useState` returns a pair: the
current state value, and a function that updates it. They can be named
anything you want; `const [numClicks, setNumClicks]` would work just as
well.

You may be wondering why we can't update the count with a simpler
statement like `count = count + 1`. If we did that, React would have no way
to know that the state has been updated. React needs to know about state
updates so that it can rerender your component with the new state,
and use the new output to update the DOM. Using the updater function
`setCount` informs React about the state update so it can do its work.

> Tip: the square bracket syntax used here is a modern JS feature called
> [array destructuring.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)
>
> The official [React docs](https://reactjs.org/docs/hooks-state.html#recap)
> page for `useState` goes into more detail. Don't worry about anything it
> says about "class components"—that was how state used to work, before
> `useState`.

State can be numbers, strings, objects, or any other data. State is
not shared between instances of a component; we can put two or more
`<Counter />` elements on a page, and they will display independent
counts. Clicking the button of one won't affect the count of another.

### Rules of Hooks

`useState` is what we call a React Hook. Hooks are functions that start with
"use" and only work in components. Don’t call Hooks outside components
or inside loops, conditions, or nested functions. Instead, always use
Hooks at the top level of your React component.

```javascript
function MyComponent() {
  // OK: Hook is at top level
  const [state, setState] = useState();

  if (someCondition) {
    // BAD: Hook is inside a block, and might not be run
    const [state, setState] = useState();
  }
}
```

Don't worry too much about remembering this; running `mm start`, `build`,
or `check` analyzes your code and warns you if you are breaking the
Rules of Hooks.

> The official [React docs](https://reactjs.org/docs/hooks-rules.html)
> go into more detail and rationale on why this is.

## Next steps

By now, you've learned enough about React to make an amazing MagicMirror
module. But this isn't all MagicMirror React has to offer. It provides
its own Hooks to help you do all sorts of things, such as sending and
receiving notifications, fetching content from the Internet, and
controlling other MagicMirror modules. These features should suit most
module development needs.

Check out the module development documentation
[here](./module-development.md).

---

Does this guide need improvement?
[File an issue](https://github.com/joshwilsonvu/MagicMirror/issues/new)
and help us improve.
