# SuitCSS / BEM 101

*In case of TL;DR, scroll down for a full example*

**BEM** or **Block, Element, Modifier** methodology is a naming convention for modular CSS. Using this methodology you will implicitly define classes for 'blocks', 'elements' and 'modifiers'. Using BEM class names will ensure you that components will not take on the CSS styles from parent components or pass on styles to child components.

For someone who is more experienced with CSS, there are other ways to avoid CSS issues further down the components. But in a team with developers of different levels of CSS we need to accept that this is the way to avoid conflicts and keep a project maintainable.

## SUIT CSS Syntax

Suit Css uses a different Syntax than the original BEM syntax. Suit CSS thinks in components instead of Blocks and has a few extra features. SuitCSS uses Components, Descendant, Modifiers and States. Here's how to name the classes of these elements:

### Components
Unlike blocks in BEM, components are the exact components that you use in React. You should only have 1 component class for each component. Name the class in Pascal case just like the React naming convention.

**CSS Class naming examples:**
```CSS
.ComponentName {}
.ProductList {}
.NavigationBar {}
```
### Descendants
Descendants are the children of the component. Naming has to be Camel cased. Descendants don't have to be named several levels down if there are no conflicts within the same component.

- ComponentName (ComponentName)
-- descendant (ComponentName-descendant)
--- childOfDescendant (ComponentName-childOfDescendant)
---- childOfChildOfDescendant (ComponentName-childOfChildOfDescendant)

As you can see there is no need to write ComponentName-descendant-childOfDescendant-childOfChildOfDescendant since ComponentName-childOfChildOfDescendant already implicitly defines just that element.

**CSS Class naming examples:**
```CSS
.ComponentName-header {}
.ComponentName-topBar {}
.ComponentName-bodyText {}
.ComponentName-imgTag {}
.ComponentName-h1Tag {}
```

### Modifiers
Modifiers are different styles of the base component. To define a modifier you have to use double dashes --. If a basic info box component has three styles e.g. succes, error & warning, you will have the following classes.

**CSS Class naming examples:**
```CSS
.InfoBox { padding: 10px; border: 1px solid black; } (Base class)
.InfoBox--error { background-color: red; }
.InfoBox--success { background-color: green; }
.InfoBox--warning { background-color: orange; }
```

Note: *Don't use modifiers for styling of different states.*

### States
Suit CSS states can be used to define different styling to a component with a different state. Unlike modifiers they are applied to a certain state of the component and not just for style variations of a component. The naming convention is  "is-stateName".

**CSS Class naming examples:**

```CSS
.ComponentName.is-active {}
.ComponentName.is-pending {}
.ComponentName.is-inactive {}
```
### Utilities

Suit CSS also provides CSS class utility snippets that we can use. Use only if you need to (Currently not implemented). It's convenient but imo it's better to style within the class. The way you use them is to add them to your class names i.e
```jsx
<ComponentName className="ComponentName u-alignMiddle" />
```
**Available utilities:**
- utils-align: Vertical alignment
- utils-display: Display types
- utils-layout: Clearfix, floats, and new block formatting contexts
- utils-link: Link things
- utils-offset: The before and after packages
- utils-position: Positioning utilities
- utils-size: Percentage sizing utilities
- utils-text: Text truncation, breaking, and alignment
- utils-flex: Align elements with Flexbox


## Full example

Here's an example of the class naming convention.

**JSX**
```jsx
<ComponentName className="Product Product--onSale is-selected">
    <img className="Product-img" />
    <div className="Product-textContent">
        <h3 className="Product-title">Product title</h3>
        <p className="Product-description">Description of the product</p>
    </div>
</ComponentName>
```
**CSS**
```CCS
.Product {
    border: 1px solid lightGray;
    &-img { outline: none; }
    &-textContent { background-color: gray; }
    &-title { color: black; }
    &--onSale {
        & > .Product-title { color: red; }
    }
    &.is-selected {
        & > .Product-textContent { background-color: yellow; }
    }
}
```
That's all there is to know about SuitCSS!
