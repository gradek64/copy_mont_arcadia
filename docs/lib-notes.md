# Notes CSS

### Issue: Needs doesn't get fired in a child component

The fetch-component-data middleware will get its 'Component' tree from React Router and does not give you the actual components that are nested. So:

```javascript
<Route component="main">
  <Route component="plp"
</Route>
```

Gives you only the main and plp but not the children of the plp page
