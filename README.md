[![npm](https://img.shields.io/npm/dt/longestrepeatedstrings.svg)](#)

LONGEST REPEATED STRINGS
===========================

Generates a report about the longest repeated substrings in supplied text, weighted by how much space the string takes up overall (length * occurences).

> You input text or filenames.  It returns raw data or a text report.

(This module was designed to analyze javascript code for refactoring opportunities)

## Installation

This is a Node.JS module available from the Node Package Manager (NPM).

https://www.npmjs.com/package/minson

Here's the command to download and install from NPM:

`npm install longestrepeatedstrings -S`

or with Yarn:

`yarn add longestrepeatedstrings`

It is recommend to use a package locking system like Yarn in case a change is
introduced into this project that makes it incompatible with your encoded data.

## Usage

Include Longest Repeated Substrings in your project:

```javascript
var LRS = require('longestrepeatedstrings');
```

### Finding Repeated Substrings in Text

You can analyze a single text by using the `text` function to find the longest repeated substrings:

```javascript
const text = 'Your text content goes here';
const results = LRS.text(text, maxRes = 100, minLen = 4, maxLen = 30, minOcc = 3, omit = [], wordBound = null);
console.log(results);
```

**Parameters**:
- `text` (String): The input text to analyze.
- `maxRes` (Number, optional, default: 100): The maximum number of results to return.
- `minLen` (Number, optional, default: 4): The minimum length of substrings to consider.
- `maxLen` (Number, optional, default: 30): The maximum length of substrings to consider.
- `minOcc` (Number, optional, default: 3): The minimum number of occurrences a substring must have to be included.
- `omit` (Array, optional, default: []): An array of substrings to omit from the results.
- `wordBound` (Function, optional, default: null): A function to restrict matches to word boundaries. If provided, the substrings will be filtered based on this function.

**Returns**: An array of objects containing the repeated substrings, their count, and a score for each.

### Analyzing Files

You can analyze multiple files by using the `files` function. This will read the contents of the files and find repeated substrings in each one.

```javascript
const fs = require('fs');
const files = ['file1.txt', 'file2.txt'];
const results = LRS.files(files, maxRes = 100, minLen = 4, maxLen = 30, minOcc = 3, omit = [], wordBound = null);
console.log(results);
```

**Parameters**:
- `files` (Array): An array of file paths to analyze.
- `maxRes`, `minLen`, `maxLen`, `minOcc`, `omit`: Same as the parameters for the `text` function.
- `wordBound` (Function, optional, default: null): A function to restrict matches to word boundaries.

**Returns**: An object where the keys are file names and the values are the repeated substrings found in each file.

### Creating Reports

You can generate a text report for the analysis results using the `filesReport` and `textReport` functions.

#### File Analysis Report

```javascript
const report = LRS.filesReport(results, out = 0); // Pass `out = 1` to log to console
console.log(report);
```

**Parameters**:
- `results` (Object): The results returned by the `files` function.
- `out` (Number, optional, default: 0): If set to `1`, the report will be logged to the console instead of being returned as a string.

**Returns**: A text report summarizing the repeated substrings found in each file.

#### Text Analysis Report

```javascript
const report = LRS.textReport(results, out = 0); // Pass `out = 1` to log to console
console.log(report);
```

**Parameters**:
- `results` (Array): The results returned by the `text` function.
- `out` (Number, optional, default: 0): If set to `1`, the report will be logged to the console instead of being returned as an array.

**Returns**: A list of repeated substrings with their occurrence counts.

### Example Workflow

1. First, you analyze a single text:
   ```javascript
   const text = 'This is an example text with repeated substrings';
   const results = LRS.text(text);
   ```
2. Then, you analyze multiple files:
   ```javascript
   const files = ['file1.txt', 'file2.txt'];
   const results = LRS.files(files);
   ```
3. Afterward, you can generate a report:
   ```javascript
   const report = LRS.filesReport(results, 1); // Logs the report to console
   ```

### Notes

- The `text` and `files` functions automatically clean the text by removing non-alphanumeric characters and splitting it into words.
- Results are sorted by a score, which is calculated based on the length of the substring and the number of occurrences.
- You can omit specific substrings by passing them in the `omit` array.
- The `wordBound` function is an optional filter that can be passed to restrict substring matches to word boundaries. If omitted, the function defaults to allowing all matches.


## Contributing

https://github.com/braksator/minson

In lieu of a formal style guide, take care to maintain the existing coding
style. Add tests for coverage and explicitly test bugs and features.
