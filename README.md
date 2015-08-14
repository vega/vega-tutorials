# vega-tutorials

Interactive tutorials for learning Vega.

## Build Process

To build and view the tutorial files locally, follow these steps. We assume that you have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the vega-tutorials folder to install dependencies.
2. Run `npm run build`. This will create a `build` folder, generate web pages for each tutorial, and copy over all necessary resources.
3. Run a local webserver (e.g., `python -m SimpleHTTPServer 8000`) in the `build` folder and then point your web browser at it (e.g., `http://localhost:8000/`). Each tutorial resides in its own sub-folder.
