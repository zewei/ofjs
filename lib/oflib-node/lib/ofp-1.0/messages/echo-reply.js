/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

(function () {
  const util = require('util');
  const ofp = require('../ofp.js');

  const offsets = ofp.offsets.ofp_header;

  module.exports = {
    unpack: function (buffer, offset) {
      let message = {
        header: {type: 'OFPT_ECHO_REPLY'},
        body: {}
      };

      let len = buffer.readUInt16BE(offset + offsets.length, true);

      if (len < ofp.sizes.ofp_header) {
        throw new Error(util.format('%s message at offset %d has invalid length (%d).',
                                    message.header.type, offset, len));
      }

      let dataLen = len - ofp.sizes.ofp_header;
      if (dataLen > 0) {
        message.body.data = new Buffer(dataLen);
        buffer.copy(message.body.data, 0, offset + ofp.sizes.ofp_header,
                    offset + ofp.sizes.ofp_header + dataLen);
      }

      return {
        message: message,
        offset: offset + len
      };
    },
    pack: function (message, buffer, offset) {
      buffer.writeUInt8(ofp.ofp_type.OFPT_ECHO_REPLY, offset + offsets.type, true);

      var len = ofp.sizes.ofp_header;
      if ('data' in message.body) {
        len += message.body.data.length;
        message.body.data.copy(buffer, offset + ofp.sizes.ofp_header);
      }

      buffer.writeUInt16BE(len, offset + offsets.length, true);

      return {
        offset: offset + len
      };
    }
  };
})();