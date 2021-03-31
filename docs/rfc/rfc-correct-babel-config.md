- Start Date: 2018-03-21
- PR: TBC
- Issue: TBC
- Author: @davidnormo

# Summary

Our babel config allows devs to write very early stage language syntax and features.
This is dangerous because the APIs of these features may change and may never become part of the standard JS language.

# Basic example

The following can be executed from any of our source files:
```
// an example of the function bind operator currently stage 0
const fn = function() {
  return this.foo()
}
const obj = {
  foo: () => 'bar'
}
console.log(obj::fn()) // 'bar'
```

```
// an example of the do notcation, currently stage 1
console.log(do { if (1) { 'foo' } else { 'bar' } }) // 'foo'
```

# Motivation

To help stabalise the codebase and prevent our code from diverging from the javascript language standard.

# Detailed design

The .babelrc file controls the transpilation configuration for our client-side bundle built with webpack,
the server-side code run in Node, jest unit tests, tape unit tests and any other scripts that rely on
new language features. It is currently set to use the stage-0 preset which should be changed to stage-4.

We will have to include some language features that are not yet stage-4 due to their
use all over the codebase. For example:
- Decorators (stage 2) https://github.com/tc39/proposal-decorators
- Class fields (stage 3) https://github.com/tc39/proposal-class-fields
- Static public fields (stage 2) https://github.com/tc39/proposal-static-class-features/

These transforms should be added manually to .babelrc

# Drawbacks

1. If there are parts of the codebase that use new language features that would require changing to an older syntax,
there is a time and effort cost of doing that refactor and a risk of introducing bugs if the code is not well tested.

2. This may slow down adoption of new and ratified or near-ratified language features. In these cases we would
likely need to update the stage-4 preset library periodically so we are keeping up with the latest language features.
If a new syntax is added that we want to use, this should be raised in a separate RFC.

# Alternatives

We could continue to write code with bleeding edge language features but I believe the risk
of doing so, as mentioned earlier, is too great.


# Adoption strategy

As per the detailed design, this change will hopefully be non-breaking.
In the event that a very early language feature is found in the code base and it's usage is
small enough that it can be refactored to use an established syntax then that may be appropriate.

# How we teach this

Not applicable.

# Unresolved questions

None.
