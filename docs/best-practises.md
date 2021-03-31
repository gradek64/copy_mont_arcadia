# Best Practises

This document's purpose is to act as a living record of the practises that we value.

## Contents

- Use constants in place of strings for identifiers or types

  ```javascript
  // bad
  selectedDeliveryLocationTypeEquals(state, 'HOME')

  // good
  selectedDeliveryLocationTypeEquals(state, HOME)
  ```

  This is preferable in most cases because the linter cannot catch spelling mistakes in a string but it can catch a misspelled variable as it is likely to be undefined.

  Some examples of places we should probably use constants rather than strings are:
