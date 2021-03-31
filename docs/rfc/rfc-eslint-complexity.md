- Start Date: 2018-06-21
- PR: https://github.com/ag-digital/full-monty/pull/6850
- Issue: https://arcadiagroup.atlassian.net/browse/DES-3435
- Author: (@anagartmann101)

# Summary

Add the cyclomatic complexity rule to eslint.

# Basic Examples

###Example 1

High Complexity: 8
```javascript
function handleQuickview(pageName, props, nextProps) {
  if (pageName === 'plp') {
    // in plp, quick view is about to open
    if (
      !props.modal.open &&
      nextProps.modal.open &&
      nextProps.modal.mode === 'plpQuickview'
    ) {
      // when QV will open, we want to send PPV for plp
      this.resetPercentageViewed()
    }
    // in plp, quick view is about to close
    if (
      props.modal.mode === 'plpQuickview' &&
      props.modal.open &&
      !nextProps.modal.open
    ) {
      // when QV is about to close we want to reset plp's timer
      // and force to resend pageView again, we are sure all dependencies are loaded
      this.shouldResend = true
      this.startTime = Date.now()
      this.hasHandledOnLoad = false
    }
  }
}
```

Low Complexity: 4
```javascript
function quickviewAboutToOpen(modalProps, nextModalProps) {
  return !modalProps.open && nextModalProps.open && nextModalProps.mode === 'plpQuickview'
}

function quickviewAboutToClose(modalProps, nextModalProps) {
  return modalProps.mode === 'plpQuickview' && modalProps.open && !nextModalProps.open
}

function handleQuickview(pageName, props, nextProps) {
  if (pageName === 'plp') {

    if (quickviewAboutToOpen(props, nextProps)) {
      this.resetPercentageViewed()
    }

    if (quickviewAboutToClose(props, nextProps)) {
      // when QV is about to close we want to reset plp's timer
      // and force to resend pageView again, we are sure all dependencies are loaded
      this.shouldResend = true
      this.startTime = Date.now()
      this.hasHandledOnLoad = false
    }
  }
}
```

###Example 2

High Complexity
```javascript
function getErrorHandler(error) {
  if (error === 'validation-error') {/*...*/}
  else if (error === 'network-error') {/*...*/}
  else if (error === 'server-error') {/*...*/}
  // ...more conditions
  else {/*...handle unknown error*/}
}
```

Low Complexity: 2
```javascript
function getErrorHandler(error) {
  let errorTypeToMarkupMap = {
    'validation-error': function () {/*...*/},
    'network-error': function () {/*...*/},
    'server-error': function () {/*...*/},
    // ...more errors
  };
  
  if (errorTypeToMarkupMap.hasOwnProperty(error)) {
    return errorTypeToMarkupMap[error];
  }
  
  /*...handle unknown error*/
}
```

# Motivation

Currently:
 - 10 files have the cyclomatic complexity higher than 20
 - 78 files have the cyclomatic complexity higher than 10
 - 165 files have the cyclomatic complexity higher than 7

Having a high cyclomatic complexity not only makes the code harder to read but also harder to test.
 
We are aiming for a cyclomatic complexity of maximum of 7 across the entire code base. 


# Drawbacks

Until we refactor the files with a high cyclomatic complexity we will have lots of eslint warnings.

# Alternatives

Introduce the max-depth and/or max-statements eslint rules.

# Adoption strategy

As there are lots of files that have the complexity higher than the target value, we will have to reach the goal incrementally. 

We will start by adding the eslint rule as a warning and with a maximum value of 20. 

As we refactor the functions, we will decrease the eslint limit until it reaches our target value. 

The last step will be to change the warning to an error.

# How we document this

https://eslint.org/docs/rules/complexity
