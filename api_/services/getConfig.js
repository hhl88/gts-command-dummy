/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-01T17:08:20+01:00
* @Last modified by:   igor
* @Last modified time: 2016-03-17T13:50:18+01:00
*/

const config = require('../../config');
const workingDirPath = config.clonePath;
const remoteDir = config.configRepo;
const fs = require('fs-extra');
