var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/index.ts
import externalGlobals from "rollup-plugin-external-globals";
import fs from "fs";
import path from "path";

// src/autoComplete.ts
var modulesConfig = {
  "react": {
    var: "React",
    jsdeliver: {
      path: "umd/react.production.min.js"
    }
  },
  "react-dom": {
    var: "ReactDOM",
    jsdeliver: {
      path: "umd/react-dom.production.min.js"
    }
  },
  "react-router-dom": {
    var: "ReactRouterDOM",
    jsdeliver: {
      path: "umd/react-router-dom.min.js"
    }
  },
  "antd": {
    var: "antd",
    jsdeliver: {
      path: "dist/antd.min.js",
      css: "dist/antd.min.css"
    }
  },
  "ahooks": {
    var: "ahooks",
    jsdeliver: {
      path: "dist/ahooks.js"
    }
  },
  "@ant-design/charts": {
    var: "charts",
    jsdeliver: {
      path: "dist/charts.min.js"
    }
  },
  "vue": {
    var: "Vue",
    jsdeliver: {
      path: "dist/vue.global.prod.js"
    }
  },
  "vue2": {
    var: "Vue",
    jsdeliver: {
      name: "vue",
      path: "dist/vue.runtime.min.js"
    }
  },
  "@vueuse/shared": {
    var: "VueUse",
    jsdeliver: {
      path: "index.iife.min.js"
    }
  },
  "@vueuse/core": {
    var: "VueUse",
    jsdeliver: {
      path: "index.iife.min.js"
    }
  },
  "moment": {
    var: "moment",
    jsdeliver: {
      path: "moment.min.js"
    }
  },
  "eventemitter3": {
    var: "EventEmitter3",
    jsdeliver: {
      path: "umd/eventemitter3.min.js"
    }
  },
  "file-saver": {
    var: "window",
    jsdeliver: {
      path: "dist/FileSaver.min.js"
    }
  },
  "browser-md5-file": {
    var: "browserMD5File",
    jsdeliver: {
      path: "dist/index.umd.min.js"
    }
  },
  "xlsx": {
    var: "XLSX",
    jsdeliver: {
      path: "dist/xlsx.full.min.js"
    }
  },
  "axios": {
    var: "axios",
    jsdeliver: {
      path: "dist/axios.min.js"
    }
  },
  "lodash": {
    var: "_",
    jsdeliver: {
      path: "lodash.min.js"
    }
  },
  "crypto-js": {
    var: "crypto-js",
    jsdeliver: {
      path: "crypto-js.min.js"
    }
  },
  "localforage": {
    var: "localforage",
    jsdeliver: {
      path: "dist/localforage.min.js"
    }
  }
};
function isJsdeliver(prodUrl) {
  return prodUrl.includes("//cdn.jsdelivr.net");
}
function isUnpkg(prodUrl) {
  return prodUrl.includes("//unpkg.com");
}
function isCdnjs(prodUrl) {
  return prodUrl.includes("//cdnjs.cloudflare.com");
}
function autoComplete(name) {
  const config = modulesConfig[name];
  if (!config) {
    throw new Error(`The configuration of module ${name} does not exist `);
  }
  return (prodUrl) => {
    if (isCdnjs(prodUrl)) {
      throw new Error(`The configuration of module ${name} in ${prodUrl} does not exist `);
    } else {
      if (!(isJsdeliver(prodUrl) || isUnpkg(prodUrl))) {
        console.warn("Unknown prodUrl, using the jsdeliver rule");
      }
      return __spreadValues({
        name,
        var: config.var
      }, config.jsdeliver);
    }
  };
}

// src/index.ts
function getModuleVersion(name) {
  const pwd = process.cwd();
  const pkgFile = path.join(pwd, "node_modules", name, "package.json");
  if (fs.existsSync(pkgFile)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
    return pkgJson.version;
  }
  return "";
}
function isFullPath(path2) {
  return path2.startsWith("http:") || path2.startsWith("https:") || path2.startsWith("//");
}
function renderUrl(url, data) {
  const { path: path2 } = data;
  if (isFullPath(path2)) {
    url = path2;
  }
  return url.replace(/\{name\}/g, data.name).replace(/\{version\}/g, data.version).replace(/\{path\}/g, path2);
}
function PluginImportToCDN(options) {
  const {
    modules = [],
    prodUrl = "https://cdn.jsdelivr.net/npm/{name}@{version}/{path}"
  } = options;
  let isBuild = false;
  const data = modules.map((m) => {
    let v;
    if (typeof m === "function") {
      v = m(prodUrl);
    } else {
      v = m;
    }
    const version = getModuleVersion(v.name);
    let pathList = [];
    if (Array.isArray(v.path)) {
      pathList = v.path;
    } else if (v.path) {
      pathList.push(v.path);
    }
    const data2 = __spreadProps(__spreadValues({}, v), {
      version
    });
    pathList = pathList.map((p) => {
      if (!version && !isFullPath(p)) {
        throw new Error(`modules: ${data2.name} package.json file does not exist`);
      }
      return renderUrl(prodUrl, __spreadProps(__spreadValues({}, data2), {
        path: p
      }));
    });
    let css = [];
    if (Array.isArray(v.css)) {
      css = v.css;
    } else if (v.css) {
      css = [v.css];
    }
    const cssList = css.map((c) => renderUrl(prodUrl, __spreadProps(__spreadValues({}, data2), {
      path: c
    })));
    return __spreadProps(__spreadValues({}, v), {
      version,
      pathList,
      cssList
    });
  });
  const externalMap = {};
  data.forEach((v) => {
    if (v.var) {
      externalMap[v.name] = v.var;
    }
  });
  const externalLibs = Object.keys(externalMap);
  const plugins = [
    {
      name: "vite-plugin-cdn-import",
      config(_, { command }) {
        const userConfig = {
          build: {
            rollupOptions: {}
          }
        };
        if (command === "build") {
          isBuild = true;
          userConfig.build.rollupOptions = {
            external: [...externalLibs],
            plugins: [externalGlobals(externalMap)]
          };
        } else {
          isBuild = false;
        }
        return userConfig;
      },
      transformIndexHtml(html) {
        const cssCode = data.map((v) => v.cssList.map((css) => `<link href="${css}" rel="stylesheet">`).join("\n")).filter((v) => v).join("\n");
        const jsCode = !isBuild ? "" : data.map((p) => p.pathList.map((url) => {
          if (p.esmodule) {
            return `<script type="module" src="${url}"><\/script>`;
          }
          return `<script src="${url}"><\/script>`;
        }).join("\n")).join("\n");
        return html.replace(/<\/title>/i, `</title>${cssCode}
${jsCode}`);
      }
    }
  ];
  return plugins;
}
var src_default = PluginImportToCDN;
export {
  PluginImportToCDN as Plugin,
  autoComplete,
  src_default as default
};
