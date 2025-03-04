import { Plugin } from 'vite';

interface Module {
    name: string;
    var: string;
    path: string | string[];
    css?: string | string[];
    esmodule?: boolean;
}
interface Options {
    modules: (Module | ((prodUrl: string) => Module))[];
    prodUrl?: string;
}

/**
 * module 配置自动完成
 */
declare const modulesConfig: {
    react: {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    'react-dom': {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    'react-router-dom': {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    antd: {
        var: string;
        jsdeliver: {
            path: string;
            css: string;
        };
    };
    ahooks: {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    '@ant-design/charts': {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    vue: {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    vue2: {
        var: string;
        jsdeliver: {
            name: string;
            path: string;
        };
    };
    '@vueuse/shared': {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    '@vueuse/core': {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    moment: {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    eventemitter3: {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    'file-saver': {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    'browser-md5-file': {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
    xlsx: {
        var: string;
        jsdeliver: {
            path: string;
        };
    };
};
declare type ModuleName = keyof typeof modulesConfig;
declare function autoComplete(name: ModuleName): (prodUrl: string) => Module;

declare function PluginImportToCDN(options: Options): Plugin[];

export default PluginImportToCDN;
export { Options, PluginImportToCDN as Plugin, autoComplete };
