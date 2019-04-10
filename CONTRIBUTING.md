# Contributing

## Development

We use [RushJS](https://rushjs.io) to manage this repository. Some quick notes on how to manage the repository are documented [here](https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d). 

**Install dependencies** -- You only need to run this once.

```sh
npm install -g @microsoft/rush
```

**Update packages** -- Run this if you add/remove packages from this repository.

```sh
rush update --full
```

**Rebuild and test** -- Do this each time you make changes to the code

```sh
rush rebuild --verbose
rush test --verbose
```

The above notes will help you decide which commands to run during development on your own machine. But for any commits and pull requests in this repository, the entire test suite will be run using continuous integration.

## Issues

We use GitHub issues to track bugs. Please ensure your description is clear and has sufficient instructions to be able to reproduce the issue.

## Pull requests

Always fork the repo and create your branch from master. If you've added code that should be tested, add tests. Alsp ensure the test suite passes before submitting the PR.

## Coding style

Please follow the [TypeScript coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

## Release process

The release manager will publish packages to NPM using these commands.

```
$ rush version --bump --override-bump minor
$ rush update --full
$ rush rebuild
$ rush test
$ rush publish --publish --include-all
```
