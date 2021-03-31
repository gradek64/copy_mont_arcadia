- Start Date: 2018-04-03
- PR: TBC
- Issue: TBC
- Author: (@janoist1)

# Summary

Our eslint config doesn't allow us to put dangling commas for multiline statements.
This makes code diffs less clean and may increase time and energy spent on Pull-Requests.

# Basic example

```javascript
var foo = {
    bar: "baz",
    qux: "quux",
}
```

# Motivation

Trailing commas simplify adding and removing items to objects and arrays, since only the lines you are modifying must be touched. Another argument in favor of trailing commas is that it improves the clarity of diffs when an item is added or removed from an object or array:

Less clear:

```javascript
 var foo = {
-    bar: "baz",
-    qux: "quux"
+    bar: "baz"
 }
 ```

More clear:

```javascript
 var foo = {
     bar: "baz",
-    qux: "quux",
 }
 ```

# Drawbacks

Why should we *not* do this? Please consider:

- While introducing, it may cause conflicts on feature branches that might have to be resolved manually

# Alternatives

Not using comma-dangle

# Adoption strategy

- eslint needs to be set with this rule
- run lint --fix command
- resolve possible conflicts on feature branches with ongoing work

# How we document this

https://eslint.org/docs/rules/comma-dangle
