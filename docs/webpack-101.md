# Webpack 101
This is a run through of how we apply webpack to our project. Start here if you want to understand the basics. If you're going to do more advanced things, please check https://webpack.github.io/docs/ after reading this.

## How does this work?
Webpack is run on node so the command to use webpack is to type 'webpack' in your terminal. To use it for development we use 'webpack dev server'.

### Ok wait wait.. so whats this webpack dev server? Is it webpack?
webpack web server is a node web server that runs webpack for you so you can see the bundled files/assets served through a port like 8080

### Ok so what essential concepts do I need to know about Webpack

- Webpack is a bundler... Give it an entry file as an input and it will recursively go through all the imports/requires and see all the modules that you need.
- Entry point? an entry point is a file or an array of files that webpack needs to start in to start to resolve modules. So if A is your entry point and in A you are importing file B & C, your bundle will contain A, B, C. If A & B are your entry points in array like [A, B] and both files import C, your bundle will contain A, B, C.
- So one bundle will contain all your modules? Usually yes.. unless you specify to split your bundle like we do. We split our bundle in a vendor file where our most common external modules (npm ones) are located in the vendor bundle, our source code in the main 'bundle' and service desk code in the service-desk bundle. Each entry point is named by us and outputs one bundle.
- So if the javascript gets bundles how does our CSS gets bundled? Ok step back.. So webpack reads in requires and imports. It reads this in using a 'loader'. So loaders are actually loading your webpack into your bundle by performing an operation on it. JS and JSX files are loaded in by using the babel loader. Babel transpiles your cutting edge ES2016 & 17 code into es5 syntax. We have setup our CSS extenstions to be loaded in by the style loader. By defining a regex that matches the file name we can set up the right loaders for css.
- But I need my file to be loaded in by multiple loaders... You can have a composition of loaders to load in a file or module. The loader will pass the transformed output of each loader from left to right.
- Whats the difference between a loader and plugin then? So a loader takes on a specific require or import. That file goes through the loader. A plugin is something that performs action on the files that are going to be created. So loaders set up a bundle or files and those bundle/files goes through a series of plugins.
- Ok cool.. what plugins are we using? CommonsChunkPlugin makes sure we do not add our common modules in our main bundle. IgnorePlugin will skip the specified module so even if you require a certain module it will not include the ignored modules to your bundle. Extract text plugin will take all our CSS files that are required in each component into one large CSS file which is called styles.css which then gets read by our custom Brand CSS plugin who will turn this CSS file into 6 brand styles.css using veriables and PostCSS. The Manifest plugin is used for our Async bundle splitting. It will keep a reference inside the JS file to fire a specific bundle thats not included upon loading. Generate Assets will create a json object of all the files we make through webpack. For production we also use CssNano and Uglify to minify our style & js assets. Add Hashes will add hashes to the filenames and our custom responsive css plugin will split our media queries into seperate files. Happy Pack is used for caching webpack chunks. See section below for more info about our custom plugins.

### So what else do I need to know?

We have a helper file called build-utilities.js that helps us with shared functions across both production and development with webpack. These functions deal with creating css for our brands and to modify the css with (custom) postcss.

A few of our custom plugins are complex and need some basic description of what they do and how they work. Let's look at a few of them:

#### AddHashes

This plugin creates hashes to all to be created files by webpack. Since we create many new files during webpack compilation time, we can't use the webpack hash method. This plugin solves that problem for us and lets us have more control on how we hash our files.

#### BrandCssPlugin
This plugin actually starts by adding brands to our webpack config using **addBrandsProd/Dev** from our build utilities. This happens at the end of the config file so that when webpack runs it knows which brands we have to make assets for. This primarily concerns our basic default css which is called styles.css. This file is created by ExtractTextPlugin which takes all the required css files, puts them through the css loader and then adds every css file into a single styles.css. The BrandCssPlugin takes this styles.css and creates several styles-(brandname).css. It then uses 'gathervariables' to take each brand css variables and 'customPostcss' to apply a series of postcss functions to each css file with the brand specific styling.

#### GeneratedAssets

This plugin takes the list of to be outputted files from webpack and add them to a .json file in public. This file consists of regular filenames for each created file as the key and has the hashed filename as the value. This way we can import styles.css and bundles.css from the generated-assets.json in the codebase even if the filenames are hashed.

#### ResponsiveCssPlugin

This plugin is used in production and takes styles.css and uses postcss to take out the media queries specified in the responsive constants to create seperate css files for each responsive breakpoint.

#### CssNanoPlugin

This plugin allows us to use postcss plugin as a webpack plugin to apply css optimizations at the end of all the to be created css files.

