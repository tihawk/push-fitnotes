---
sidebar_position: 5
---

# Contributing

Improvements and fixes are always welcome. If you see any unassigned issues, feel free to try them out.

## Pull Requests

Make sure:

1. The code compiles
2. You can build it for at least Windows and Linux
3. The code follows established conventions of the codebase
4. Docs are updated with changes made

## Development

Should be as simple as `npm install` and `npm start` for running the dev app.

## Build and Package

Always try and build and package with your changes

### Build

`npm run make`

### Package Windows

`npm run package -- --platform=win64`

### Package Linux

`npm run package`

## Contributing to the docs

The docs use [Docusaurus](https://docusaurus.io), and are mostly written in Markdown.

The docs can be run locally from the `docs` dir

```bash
$ cd push-fitnotes/docs/
$ npm start
```

After Docusaurus is up, you can view the docs in your browser under `https://localhost:3000`. After you make your changes, you should be able to view them in your local instance. After your changes have been merged, the live instance of the docs will be manually deployed by the pull request assignee.
