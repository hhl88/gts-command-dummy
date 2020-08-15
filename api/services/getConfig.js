'use strict';

/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-01T17:08:20+01:00
* @Last modified by:   igor
* @Last modified time: 2016-03-17T13:50:18+01:00
*/

var config = require('../../config');
var workingDirPath = config.clonePath;
var remoteDir = config.configRepo;
var fs = require('fs-extra');