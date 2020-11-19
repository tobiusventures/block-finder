// native modules
const fs = require('fs');
const path = require('path');

// external modules
const fg = require('fast-glob');

/**
 * Determine if content includes pattern (text or regexp)
 *
 * @param {String} content
 * @param {String|RegExp} pattern
 * @return {Boolean}
 */
function includes(content, pattern) {
  if (pattern instanceof RegExp) {
    return pattern.test(content);
  }
  return content.includes(pattern);
}

/**
 * Use globs to find files and regex tokens to find text block matches inside those files
 *
 * @class BlockFinder
 */
class BlockFinder {

  /**
   * Instantiate BlockFinder
   *
   * @param {Object} props
   * @return {BlockFinder} instance
   */
  constructor(props) {
    // required
    this.glob = props.glob;
    this.start = props.start;
    this.stop = props.stop;

    // optional
    this.cwd = path.resolve(props.cwd || process.cwd());
    this.ignore = props.ignore || '**/node_modules';
  }

  /**
   * Convert relative file paths to absolute file paths
   *
   * @param {Array} relatives
   * @return {Array} absolutes
   */
  toAbsolutes(relatives) {
    return relatives.map((relative) => path.resolve(`${this.cwd}/${relative}`));
  }

  /**
   * Extract matching text block matches from text content
   *
   * @param {String} content
   * @return {Promise.<Array>} blocks
   */
  extractMatches(content) {
    const matches = [];
    let index = -1;
    let recording = false;
    content.split(/\n/).forEach((line) => {
      if (includes(line, this.start)) {
        index += 1;
        recording = true;
        matches[index] = '';
      } else if (includes(line, this.stop)) {
        recording = false;
      } else if (recording) {
        matches[index] += matches[index] ? `\n${line}` : line || '';
      }
    });
    return matches;
  }

  /**
   * Convert absolute file paths to file content objects
   *
   * @param {Array} absolutes
   * @return {Promise.<Array>} objects
   */
  async toObjects(absolutes) {
    return Promise.all(absolutes.map(async (absolute) => {
      const content = await fs.promises.readFile(absolute, 'utf8');
      const matches = includes(content, this.start) && includes(content, this.stop);
      return {
        content,
        matches: matches ? this.extractMatches(content) : [],
        path: path.parse(absolute),
      };
    }));
  }

  /**
   * Convert absolute file paths to file content objects synchronously
   *
   * @param {Array} absolutes
   * @return {Array} objects
   */
  toObjectsSync(absolutes) {
    return absolutes.map((absolute) => {
      const content = fs.readFileSync(absolute, 'utf8');
      const matches = includes(content, this.start) && includes(content, this.stop);
      return {
        content,
        matches: matches ? this.extractMatches(content) : [],
        path: path.parse(absolute),
      };
    });
  }

  /**
   * Find text blocks
   *
   * @return {Promise.<Array>} blocks
   */
  async find() {
    return fg(this.glob, { cwd: this.cwd, ignore: this.ignore })
      .then((relatives) => this.toAbsolutes(relatives))
      .then((absolutes) => this.toObjects(absolutes));
  }

  /**
   * Find text blocks synchronously
   *
   * @return {Array} blocks
   */
  findSync() {
    const relatives = fg.sync(this.glob, { cwd: this.cwd, ignore: this.ignore });
    const absolutes = this.toAbsolutes(relatives);
    const objects = this.toObjectsSync(absolutes);
    return objects;
  }
}

module.exports = BlockFinder;
