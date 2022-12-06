const crypto = require('crypto');

exports.getHash = (str) => crypto.createHash('md5').update(str).digest("hex");