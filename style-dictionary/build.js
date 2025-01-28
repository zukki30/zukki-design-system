const StyleDictionary = require('style-dictionary');
const path = require('path');

const styleDictionary = StyleDictionary.extend(path.join(__dirname, 'config.json'));
styleDictionary.buildAllPlatforms();