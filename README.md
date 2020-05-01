# declick

## Features

## Usage

[![pipeline status](https://gitlab.com/colombbus/declick/badges/phaser/pipeline.svg)](https://gitlab.com/colombbus/declick/-/commits/phaser)

This project is a monorepo and uses `lerna` to manage dependencies, dev tools, etc.

- install main project `lerna` dependency :

```bash
yarn
```

- install all dependencies in all projects :

```bash
yarn run install-all
```

OR

```bash
lerna bootstrap --use-workspaces
```

- run & watch all projects :

```bash
yarn serve
```

- run unit in all projects :

```bash
yarn run unit
```

- run & watch unit in all projects :

```bash
yarn run unit:watch
```
