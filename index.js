#!/usr/bin/env node
'use strict';

/**
 * @file
 * Longest Repeated Strings.
 */

let fs = require('fs');

let lrs = module.exports = {

  // Restricts matches to word boundaries.
  wordBound: (txt, string) => !!txt.match(new RegExp(`[^a-zA-Z0-9\\s\n]${string}|\\n${string}`, 'g')),

  // Finds repeated strings in a piece of text.
  text: (txt, opts) => {
    let cleanedText = txt.replace(/[^\w]/g, ' '), words = cleanedText.split(/\s+/), substrings = {},
      defaults = {maxRes: 100, minLen: 4, maxLen: 30, minOcc: 3, omit: [], wb: false}, opts = { ...defaults, ...opts };
    for (let len = maxLen; len >= minLen; len--) {
      for (let word of words) {
        if (word.length === len) {
          if (!substrings[word]) substrings[word] = 0;
          substrings[word]++;
        }
      }
    }
    let results = Object.keys(substrings)
      .filter(substring => substrings[substring] >= minOcc && (!wb || wordBound(txt, substring)) && !omit.includes(substring.toLowerCase()))
      .map(substring => ({
        substring: substring,
        count: substrings[substring],
        score: Math.max(1, (substring.length - 3)) * Math.max(1, substrings[substring] - 1)
      }));
    results.sort((a, b) => b.score - a.score);
    let filteredResults = [],
      seen = new Set();
    for (let result of results) {
      if (![...seen].some(s => s.includes(result.substring))) {
        filteredResults.push(result);
        seen.add(result.substring);
      }
    }
    return filteredResults.sort((a, b) => b.score - a.score).slice(0, maxRes);
  },

  // Finds results in files.
  files: (files, opts) => {
    let ret = {};
    files.forEach(f => ret[f] = text(fs.readFileSync(f, { encoding: 'utf8', flag: 'r' }), opts));
    return ret;
  },

  // Creates a text report for files analysis, with optional console output.
  filesReport: (results, out = 0) => Object.entries(results).map(([filename, res]) => {
    let output = `\r\nAnalysis of repeated strings in "${filename}": ` + textReport(res).join(', ');
    out && console.log(output);
    return output;
  }).join(''),

  // Creates a text report for text analysis, with optional console output.
  textReport: (results, out = 0) => {
    let output = Array.from(new Set(results.map(result => `${result.substring} (${result.count}x)`)));
    out && console.log(output);
    return output;
  }

};