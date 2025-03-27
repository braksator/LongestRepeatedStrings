#!/usr/bin/env node
'use strict';

/**
 * @file
 * Longest Repeated Strings.
 */

let fs = require('fs');

let lrs = module.exports = {

  // Handles progress counter.
  prog: (processed, total, opts, progObj, final = 0) => {
    if (opts.prog) {
      let percent = Math.min(100, ((processed / total) * 100)).toFixed(2) + "%",
        progText = opts.progText;
      progObj = {v: `${progText}${percent}`};
      if (typeof process !== "undefined" && process.stdout && process.stdout.write) {
        process.stdout.write(`\r${progObj.v}`);
        final && process.stdout.write(`\r`);
      }
    }
  },

  // Processes segments using an alternative method.
  processSegments: (segments, strings, opts, totalChars, index = 0, processedChars = 0) => {
    lrs.prog(processedChars, totalChars, opts);
    let seg = segments[index], len = seg.length;
    for (let i = 0; i <= len - opts.minLen; i++) {
      for (let j = opts.minLen; j <= opts.maxLen && i + j <= len; j++) {
        let substr = seg.substring(i, i + j);
        if (!strings[substr]) strings[substr] = 0;
        strings[substr]++;
      }
    }
    processedChars += len;
    setTimeout(() => lrs.processSegments(segments, strings, opts, totalChars, index, index + 1, processedChars), 10);
  },

  // Finds repeated substrings in a piece of text.
  text: (txt, opts, progObj = {}) => {
    opts = { ...{ maxRes: 50, minLen: 4, maxLen: 120, minOcc: 3, omit: [], trim: 1, clean: 1, words: 1, break: [], penalty: 0, prog: 0, progID: null, progText: '' }, ...opts };
    txt = opts.clean ? txt.replace(/[^\w]/g, '\0') : txt;
    let strings = {},
      segments = (opts.words || opts.break.length) ?
        txt.split(new RegExp(`(${opts.words ? '\\s+' : ''}${opts.break.length ? opts.break.join('|') : ''}|\\0)`)).filter(segment => segment !== '' && segment !== '\u0000')
        : txt.split('\0').filter(segment => segment !== ''),
      totalChars = segments.reduce((sum, seg) => sum + seg.length, 0),
      processedChars = 0;
    lrs.prog(processedChars, totalChars, opts, progObj);

    if (opts.words) {
      strings = segments.reduce((acc, word) => {
        if ((!opts.minLen || word.length >= opts.minLen) && (!opts.maxLen || word.length <= opts.maxLen))
          acc[word] = (acc[word] || 0) + 1;
        processedChars += word.length;
        lrs.prog(processedChars, totalChars, opts, progObj);
        return acc;
      }, {});
    }
    else {
      if (opts.prog) {
        // Do it the slow way.
        lrs.processSegments(segments, strings, opts, totalChars);
      }
      else {
        // Do it the fast way.
        for (let seg of segments) {
          let len = seg.length;
          for (let i = 0; i <= len - opts.minLen; i++) {
            for (let j = opts.minLen; j <= opts.maxLen && i + j <= len; j++) {
              let substr = seg.substring(i, i + j);
              if (!strings[substr]) strings[substr] = 0;
              strings[substr]++;
            }
          }
          processedChars += seg.length;
          lrs.prog(processedChars, totalChars, opts, progObj);
        }
      }
    }
    lrs.prog(totalChars, totalChars, opts, progObj, 1);

    let res = Object.keys(strings)
      .filter(substr => strings[substr] >= opts.minOcc && !opts.omit.includes(substr.toLowerCase()))
      .map(substr => ({ substring: substr, count: strings[substr], score: (substr.length - opts.penalty) * strings[substr] }));
    if (opts.trim) res = res.map(obj => ({ ...obj, substring: obj.substring.trim() })).filter(obj => obj.substring !== "");
    res.sort((a, b) => b.score - a.score);
    let ret = [], seen = new Set();
    for (let r of res) {
      if (![...seen].some(s => s.includes(r.substring))) {
        ret.push(r);
        seen.add(r.substring);
      }
    }

    return ret.slice(0, opts.maxRes);
  },

  // Finds results in files.
  files: (files, opts, progObj = {}) => {
    let ret = {};
    files.forEach(f => ret[f] = lrs.text(fs.readFileSync(f, { encoding: 'utf8', flag: 'r' }), opts));
    return ret;
  },

  // Creates a text report for files analysis, with optional console output.
  filesReport: (results, out = 0, chars = {}) => Object.entries(results).map(([filename, res]) => {
    let ret = lrs.textReport(res, 0, chars),
      output = `📄 Analysis of repeated strings in "${filename}": ${ret ? ret : 'No results.'}\r\n`;
    out && console.log(output);
    return output;
  }).join(''),

  // Creates a text report for text analysis, with optional console output.
  textReport: (results, out = 0, chars = {}) => {
    chars = { ...{ delim: '★', open: '⦅', close: '×⦆' }, ...chars };
    let output = Array.from(new Set(results.map(result => `${result.substring}${chars.open}${result.count}${chars.close}`))).join(chars.delim) || '📄 No results.';
    out && console.log(output);
    return output;
  }

};