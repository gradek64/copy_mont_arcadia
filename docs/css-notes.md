# Notes CSS

### Issue: The state of a parent component changes but the styling of child component are affected. Who has ownership of the CSS?

e.g <ProductList /> changes from grid 2 to 3, but this makes the styling of child components change too. According to our current convention we would write the styling as following:

```Css
.ProductList > .Product {
}
.ProductList.is-col2 > .Product{
  & > .Product-image {

  }
  & > .Product-description {

  }
}
```

This causes us to put all the styling of child components inside its parent, but style ownership should remain in each seperate component.

** Possible solution **
A suggestion would be that if the styling of the same component is different, then it counts as a 'modifier' on that component. The parent component has a different state but has to give the child the approriate modifier. That means we need to pass down classNames from the parent to its children.

```Css
.Product {}
.Product .Product--col1
.Product .Product--col2
.Product .Product--col3

.Product .Product--cart

.Product .Product--diffWidth
```

### How to include new CSS file

After [PTM-336](https://github.com/ag-digital/full-monty/pull/6450) there is no need to require CSS file in the components. Webpack will bundle all CSS files automatically.

For brand specific overwrites, simply create a new CSS file following this convention `<ComponentName>-<BrandNameLowerCase>.css` e.g. `Products-topshop.css`. Webpack will bundle these files only for that brand specifically.

[More details](https://github.com/ag-digital/full-monty/blob/6fc940c3ea38662abc8e457e1f766f5993e36666/docs/rfc-001-css-webpack.md)
