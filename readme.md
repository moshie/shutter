# Shutter

Shutter captures screenshots of internal website pages and compares them for differences.

[![Travis branch](https://img.shields.io/travis/moshie/shutter/master.svg)](https://travis-ci.org/moshie/shutter)
[![npm](https://img.shields.io/npm/v/site-shutter.svg)](https://www.npmjs.com/package/site-shutter)
[![npm](https://img.shields.io/npm/dt/site-shutter.svg)](https://www.npmjs.com/package/site-shutter)
[![npm](https://img.shields.io/npm/l/site-shutter.svg)](licence.md)

## Installation

```sh
$ npm install -g site-shutter
```

## Quick Start

Quickest way to compare two environments is to use the `compare` command, navigate to a folder you want the comparisons to appear and run the command.

Compare two sites:

```bash
$ shutter compare http://example.com http://staging.com
```

> `shutter compare` accepts **two** urls or **two** folder paths containing screenshots. The screenshots must be named the same in each folder and must be (png)'s

```bash
$ shutter compare path/to/original/screenshots path/to/comparison/screenshots
```

**Screenshots**

With `shutter screenshots` it is possible to capture **any number** of environments then compare them.

Screenshot **any number** of environments:

```bash
$ shutter screenshots master=example.com develop=staging.example.com
```

> Screenshots must follow the convention [ENVIRONMENT]=[DOMAIN] the [ENVIRONMENT] is used for the output folder. Do not use symbols in the environment.

Compare the output with:

```bash
$ shutter compare master develop
```

## Command Line Options

This tool can also be further configured with the following command line flags.

    -h, --help          output usage information
        --version       output the version number

## Notes
 - The first site passed to the command defines the internal page paths for all of the other sites
 - Any Sites Larger than (600 pages +) will fail (Don't try an crawl google :$)

## Coming soon!
 - Usage with docker
 - Assign your own config values
    - Concurrency
    - Chunk size
    - Crawler depth
    - And many more
 - Module support
 - Better windows support
 - Spinners / loading bars to indicate time taken

## Licence

[MIT](licence.md)