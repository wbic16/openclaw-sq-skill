/**
 * SQ Cloud Memory - OpenClaw Skill
 * Persistent 11D text storage for agents
 */

const https = require('https');
const http = require('http');

class SQMemory {
  constructor(config) {
    this.endpoint = config.endpoint || 'https://sq.mirrorborn.us';
    this.username = config.username;
    this.password = config.password;
    this.namespace = config.namespace || 'default-agent';
    
    if (!this.username || !this.password) {
      throw new Error('SQ Cloud credentials required. Set username and password in config.');
    }
  }

  /**
   * Convert shorthand coordinate to full 11D format
   * "user/preferences/theme" → "namespace.1.1/user.preferences.theme/1.1.1"
   */
  _expandCoordinate(shorthand) {
    if (shorthand.match(/^\d+\.\d+\.\d+\/\d+\.\d+\.\d+\/\d+\.\d+\.\d+$/)) {
      return shorthand; // Already full format
    }
    
    // Convert "category/subcategory/item" to proper phext coordinate
    const parts = shorthand.split('/').map(p => p.replace(/\//g, '.'));
    const library = `${this.namespace}.1.1`;
    const collection = parts.join('.');
    const scroll = '1.1.1';
    
    return `${library}/${collection}/${scroll}`;
  }

  /**
   * Make authenticated HTTP request to SQ Cloud
   */
  _request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.endpoint + path);
      const isHttps = url.protocol === 'https:';
      const lib = isHttps ? https : http;
      
      const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'text/plain',
          'User-Agent': 'OpenClaw-SQ-Skill/0.1.0'
        }
      };
      
      if (body) {
        options.headers['Content-Length'] = Buffer.byteLength(body);
      }
      
      const req = lib.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', reject);
      
      if (body) {
        req.write(body);
      }
      req.end();
    });
  }

  /**
   * Store text at a coordinate
   */
  async remember(coordinate, text) {
    const fullCoord = this._expandCoordinate(coordinate);
    const encoded = encodeURIComponent(fullCoord);
    
    await this._request('POST', `/insert?c=${encoded}`, text);
    
    return {
      success: true,
      coordinate: fullCoord
    };
  }

  /**
   * Retrieve text from a coordinate
   */
  async recall(coordinate) {
    const fullCoord = this._expandCoordinate(coordinate);
    const encoded = encodeURIComponent(fullCoord);
    
    try {
      const text = await this._request('GET', `/select?c=${encoded}`);
      return text;
    } catch (err) {
      if (err.message.includes('404')) {
        return null; // Not found
      }
      throw err;
    }
  }

  /**
   * Delete memory at a coordinate
   */
  async forget(coordinate) {
    const fullCoord = this._expandCoordinate(coordinate);
    const encoded = encodeURIComponent(fullCoord);
    
    try {
      await this._request('DELETE', `/delete?c=${encoded}`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * List all coordinates matching a prefix
   */
  async list_memories(prefix) {
    const fullPrefix = this._expandCoordinate(prefix);
    const encoded = encodeURIComponent(fullPrefix);
    
    try {
      const response = await this._request('GET', `/toc?c=${encoded}`);
      const lines = response.split('\n').filter(l => l.trim());
      return lines;
    } catch (err) {
      if (err.message.includes('404')) {
        return []; // No memories found
      }
      throw err;
    }
  }

  /**
   * Update (overwrite) text at a coordinate
   */
  async update(coordinate, text) {
    return this.remember(coordinate, text);
  }
}

/**
 * OpenClaw skill initialization
 */
module.exports = {
  name: 'sq-memory',
  version: '0.1.0',
  
  async init(config) {
    const sq = new SQMemory(config);
    
    return {
      tools: {
        remember: sq.remember.bind(sq),
        recall: sq.recall.bind(sq),
        forget: sq.forget.bind(sq),
        list_memories: sq.list_memories.bind(sq),
        update: sq.update.bind(sq)
      }
    };
  }
};
