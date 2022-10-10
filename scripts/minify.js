const { readFileSync, writeFileSync, fstat } = require('fs');
const glob = require('glob');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const acorn = require('acorn');
const walk = require('acorn-walk');
const astring = require('astring');
const esbuild = require('esbuild');

const namesGenerator = () => {
  let namesMap = new Map();
  let usedNames = new Set();
  let names = 'abcdefghijklmnopqrstuvwxyz';
  let index = 0;

  return {
    getMap: () => {
      return namesMap;
    },
    next: (name, isCssProperty) => {
      if (namesMap.has(name)) {
        return namesMap.get(name);
      }

      if (usedNames.has(name)) {
        return name;
      }

      let iterationIndex = Math.ceil((index + 1) / names.length) - 1;
      let nameIndex = index % names.length;
      let shortName = names[nameIndex];
      
      if (iterationIndex > 0) shortName += names[iterationIndex - 1];
      if (isCssProperty) shortName = '--' + shortName;
      
      namesMap.set(name, shortName);
      usedNames.add(shortName);
      index++;

      return shortName;
    }
  }
};

const minify = async () => {
  const uniqueNameIterator = namesGenerator();

  const minifyCss = async (cssContent) => {
    const classNamesShortener = selectorParser((selectors) => {
      selectors.walkClasses((node) => {
        node.value = uniqueNameIterator.next(node.value);
      });
    });
  
    const cssVarRegexp = /var\(--([a-z-0-9,\s])+\)/gm;
    const cssPropertiesShortener = (declaration) => {
      const { prop, value, variable } = declaration;
  
      if (prop && variable) {
        declaration.prop = uniqueNameIterator.next(prop, true);
      }
  
      const isCssProperty = value && value.includes('var(--');
      if (isCssProperty) {
        const cssVars = value.match(cssVarRegexp);
        const nextValue = cssVars.reduce((fullValue, cssVar) => {
          const varName = cssVar.slice(4, -1);
          const nextVarName = uniqueNameIterator.next(varName, true);
  
          return fullValue.replaceAll(varName, nextVarName);
  
        }, value);
  
        declaration.value = nextValue;
      }
    };
  
    const postcssPlugin = () => ({
      postcssPlugin: 'classNameShortener',
      Rule (rule) {
        classNamesShortener.process(rule);
      },
      Declaration: {
        '*': cssPropertiesShortener,
      }
    });
    const result = await postcss([postcssPlugin()]).process(cssContent, { from: undefined });
    const minifiedCss = result.root.toString();

    return minifiedCss;
  };

  const minifyJs = (jsContent) => {
    const namesMap = uniqueNameIterator.getMap();

    const ast = acorn.parse(jsContent, {
      ecmaVersion: 2020,
    });

    const replaceStrings = (node) => {
      const isLiteral = node.type === 'Literal';
      const valueAccesor = isLiteral ? 'value' : 'raw';
      if (typeof node[valueAccesor] !== 'string') {
        return;
      }

      const valueWords = node[valueAccesor].split(' ');
      const nextValue = valueWords.map(w => {
        if (namesMap.has(w)) {
          return namesMap.get(w);
        }

        if (w.startsWith('--')) {
          let [cssVar, ...rest] = w.split(':');

          if (namesMap.has(cssVar)) {
            cssVar = namesMap.get(cssVar);
          }

          return [cssVar, ...rest].join(':');
        }

        return w;
      }).join(' ');

      if (isLiteral) {
        node.raw = '"' + nextValue + '"';
      } else {
        node.raw = nextValue;
      }
    };

    walk.simple(ast, {
      Literal: replaceStrings,
      TemplateElement: (node) => replaceStrings(node.value),
    });
    
    const codeFromAst = astring.generate(ast);
    const { code: minifiedJsContent } = esbuild.transformSync(codeFromAst, {
      loader: 'js',
      minify: true,
    });

    return minifiedJsContent;
  };

  const [cssFileName] = glob.sync('dist/assets/*.css');
  const [jsFileName] = glob.sync('dist/assets/*.js');
  const cssContent = readFileSync(cssFileName, 'utf-8');
  const jsContent = readFileSync(jsFileName, 'utf-8');

  const minifiedCssContent = await minifyCss(cssContent);
  const minifiedJsContent = await minifyJs(jsContent);

  writeFileSync(cssFileName, minifiedCssContent);
  writeFileSync(jsFileName, minifiedJsContent);

  console.log({
    'CSS': `${cssContent.length} => ${minifiedCssContent.length}`,
    'JS': `${jsContent.length} => ${minifiedJsContent.length},`,
  })
}

minify();