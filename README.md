# healthcafe-client
Simple HTML5 Client for healthcafe. The client can synchronize its data with an open mHealth API, such as implemented in the NRC portal.

## Installation
Prerequisites: bower and ionic framework are installed

Use the following commands to get started. The app will be launched at http://localhost:8100 (or similar, see the output of `ionic serve`)
```bash
git clone https://github.com/roberthorlings/healthcafe-client
cd healthcafe-client
bower update
ionic serve
```

## Minification
Using `gulp` you can combine and minify the javascript and css files. Three files (and their minified counterparts) will be created in `www/dist`:
- `app.js` containing the application scripts
- `lib.js` containing all libraries used
- `app.css` containing all style sheets

Before deployment, the large list of javascripts and stylesheets in `www/index.html` should be replaced with 

```html
<link href="dist/style.min.css" rel="stylesheet" />
<script src="dist/lib.min.js"></script>
<script src="dist/app.min.js"></script>
```

automatic build test
