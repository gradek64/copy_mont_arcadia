- Start Date: 2018-06-07
- PR: https://github.com/ag-digital/full-monty/pull/6729
- Issue: https://arcadiagroup.atlassian.net/browse/DES-2936
- Author: @gking2224

# Summary

Adding dependency [react-transition-group](https://www.npmjs.com/package/react-transition-group) to facilitate transitions
on add/remove of elements.

# Basic example

react-transition-group (RTG) provides a declaritive way of handling animations on the appearance, dynamic addition and
removal of page elements.

React:
```javascript
<TransitionGroup className={"itemList"}>
  {items.map(i => (
    <CSSTransition
      key={i.key}
      timeout={animationTime}
      classNames={"fade"}
      unmountOnExit
    >
      <Item className={"item"} onDelete={this.onDelete} item={i} />
    </CSSTransition>
  ))}
</TransitionGroup>
```
CSS:
```css
.item.fade-exit-active {
  opacity: 0;
}
.item.fade-exit {
  opacity: 0.01;
  transition: opacity 400ms ease-in;
}
```

# Motivation

Use transitions to provide nicer UX on removal of items from the Wishlist and the display of empty message after last
item is removed.

# Detailed design

RTG was forked from the original [React Animation addons](https://reactjs.org/docs/animation.html). It was adopted by
the community because the React/Facebook did not use it and so weren't maintaining it.
(See [https://github.com/facebook/react/issues/8125](https://github.com/facebook/react/issues/8125))

To use it, the Wishlist item container is wrapped in `<TransitionGroup>` element, and each individual Wishlist item is
wrapped in a `<CSSTransition>` element. The `TransitionGroup`/`CssTransition` components then manage the
addition/removal of appropriate classes throughout the transition lifecycle, the delayed removal of elements from the
DOM where necessary, and providing callbacks on transition lifecycle events.

For further detail, it's probably best to [RTFM](https://reactcommunity.org/react-transition-group/)!

# Drawbacks

The RTG module is estimated (by VSCode cost plugin) to be 4.7k (zipped). Given the bundle size is already huge, there is
naturally a desire not to include additional dependencies unnecessarily.

# Alternatives

## Different import style
In some cases, importing as `import component from 'library/component'` can be more efficient than `importing
{component} from 'library'` (as [tree-shaking can not always be 100% relied upon](https://github.com/reactjs/react-transition-group/issues/142#issuecomment-319979554)).

Making this change, the `cost` VSCode plugin showed no gains:

```javascript
import TransitionGroup from 'react-transition-group/TransitionGroup' 2.2K (gz)
import CSSTransition from 'react-transition-group/CSSTransition' 3.6K (gz)
```

vs:
```javascript
import { TransitionGroup, CSSTransition } from 'react-transition-group' 4.7k (gz)
```

Not only this, but the built webpack bundle was also marginally larger.

## Use another animation library
The following libraries have been considered, but in every case they are bigger than this one, as well as not widely
used and/or not actively developed:
- react-transition-hooks
- react-inline-transition-group
- state-transitions
- react-pose / popmotion-pose
- react-motion

Browsing around blogs and articles, it seems that all paths lead to RTG as the de-facto standard library.

By some margin, RTG returns the most results when searching on StackOverflow.

## CDN
Rather than including the library in the application bundle (or vendor bundle), it could be pulled separately from its
CDN location.

## Code-splitting
Wishlist code could perhaps be imported dynamically via code-splitting to only download the RTG library on demand,
minimising the effect of the extra bundle size to other parts of the site.

## Hand-crafted solution
An alternative solution using setTimeout / requestAnimationFrame has been built in a
[sandbox](https://codesandbox.io/s/lxx532mrq9) (see [here](https://codesandbox.io/s/y2x6w01k0z) for an equivalent
sandboxed solution using RTG).

Although this solution 'works' (insofar as it's been tested i.e. not very much!), the following drawbacks should be
considered:
- does not come close to handling the complex use cases that RTG supports. Any requirement to support more complex use
cases (e.g. animating the appearance of initially-rendered items, changing appearance after animation completes etc.)
would significantly and unsustainably increase the complexity (and size!) of the codebase.
- not proven / robust / browser-compliant etc.
- setTimeout / requestAnimation frame is arguably not advisable as it may be unpredictable and/or interfere with
React's lifecycle and/or rendering optimisation strategy
- the amount of code necessary to do something seemingly so simple:

```javascript
onDelete = key => () => {
  const idx = this.state.items.findIndex(i => i.key === key);
  const item = this.state.items.find(i => i.key === key);
  if (!item.deleting) {
    this.setState(
      update(this.state, {
        items: {
          $splice: [
            [
              idx,
              1,
              Object.assign({}, { ...this.state.items[idx], deleting: true })
            ]
          ]
        }
      }),
      () => setTimeout(this.removeItem(key), animationTime)
    );
  }
};

removeItem = key => () => {
  const newItems = filter(this.state.items, i => i.key !== key);

  this.setState(
    {
      items: newItems,
      showEmpty: !newItems.length
    },
    this.triggerEmptyAnimation
  );
};
triggerEmptyAnimation = () => {
  if (this.state.showEmpty && !this.state.emptyMessageActive) {
    requestAnimationFrame(this.setEmptyActive);
  }
};
setEmptyActive = () => {
  this.setState({
    emptyMessageActive: true
  });
};
  ```

The equivalent code using RTG is:

```javascript
onDelete = key => () => {
  this.setState({
    items: filter(this.state.items, i => i.key !== key)
  });
};
```
# Adoption strategy

Use of this library will be limited to the Wishlist component with no impact elsewhere, other than the overall bundle
size.

# How we document this

There is [good documentation](https://reactcommunity.org/react-transition-group/) available of this library, with
examples.
It is also widely used in the community, so plenty of resources, articles etc.
