const StyleDictionary = require('style-dictionary');

// カスタムフォーマットの定義（ダークモード用）
StyleDictionary.registerFormat({
  name: 'css/variables',
  formatter: ({ dictionary }) => {
    const lightTokens = dictionary.allProperties.filter(token => !token.path.includes('dark'));
    const darkTokens = dictionary.allProperties.filter(token => token.path.includes('dark'));

    return `
:root {
${lightTokens.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}
}

:root[data-theme="dark"] {
${darkTokens.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}
}`;
  }
});

// pxをremに変換する関数
const pxToRem = (px) => {
  const baseFontSize = 16;
  return `${px / baseFontSize}rem`;
};

// カスタムトランスフォームの定義
StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  matcher: (token) => {
    return (
      token.type === 'borderRadius' ||
      token.type === 'spacing'
    );
  },
  transformer: (token) => {
    return `${token.value}px`;
  },
});

StyleDictionary.registerTransform({
  name: 'size/rem',
  type: 'value',
  matcher: (token) => {
    return token.type === 'fontSize';
  },
  transformer: (token) => {
    return pxToRem(token.value);
  },
});

// Style Dictionary設定
const styleDictionary = StyleDictionary.extend({
  source: [
    "style-dictionary/tokens/*.json"
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "src/styles/",
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "size/px",
        "size/rem",
        "color/css"
      ],
      files: [
        {
          destination: "variables.css",
          format: "css/variables"
        }
      ],
      options: {
        showFileHeader: false,
        allowDuplicates: true
      }
    }
  },
  parsers: [{
    pattern: /\.json$/,
    parse: ({ contents, filePath }) => {
      return JSON.parse(contents);
    }
  }]
});

styleDictionary.buildAllPlatforms();