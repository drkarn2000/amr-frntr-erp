const fs = require('fs');

const origReadlink = fs.readlink;
const origReadlinkSync = fs.readlinkSync;
const origPromisesReadlink = fs.promises && fs.promises.readlink;

function patchError(err) {
  if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'ERR_FS_EISDIR')) {
    const newErr = new Error(`EINVAL: invalid argument, readlink '${err.path || ''}'`);
    newErr.code = 'EINVAL';
    newErr.errno = -4071;
    newErr.syscall = 'readlink';
    newErr.path = err.path;
    return newErr;
  }
  return err;
}

fs.readlink = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return origReadlink.call(fs, path, options, (err, linkString) => {
    if (callback) {
      callback(patchError(err), linkString);
    }
  });
};

fs.readlinkSync = function(path, options) {
  try {
    return origReadlinkSync.call(fs, path, options);
  } catch (err) {
    throw patchError(err);
  }
};

if (origPromisesReadlink) {
  fs.promises.readlink = async function(path, options) {
    try {
      return await origPromisesReadlink.call(fs.promises, path, options);
    } catch (err) {
      throw patchError(err);
    }
  };
}

console.log('[AMR-FRNTR] FAT32 libuv readlink patch loaded successfully.');

