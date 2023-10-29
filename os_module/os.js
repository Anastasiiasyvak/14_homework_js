const os = require('os');

function getOsInfo() {
  console.log('Information about operation system:');
  console.log('name:', os.platform());
  console.log('version:', os.release());
  console.log('architecture:', os.arch());
  console.log('Amount of memory (bytes):', os.totalmem());
  console.log('Information about user:', os.userInfo());
}

getOsInfo();
