import externalGlobals from 'rollup-plugin-external-globals'
import fs from 'fs'
import path from 'path'
import { Plugin, UserConfig } from 'vite'
import { Module, Options } from './type'
import autoComplete from './autoComplete'

/**
 * get npm module version
 * @param name
 * @returns
 */
function getModuleVersion(name: string): string {
    const pwd = process.cwd()
    const pkgFile = path.join(pwd, 'node_modules', name, 'package.json')
    if (fs.existsSync(pkgFile)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
        return pkgJson.version
    }

    return ''
}

/**
 * 是否完整的 url
 * @param path 
 * @returns 
 */
function isFullPath(path: string) {
    return path.startsWith('http:')
        || path.startsWith('https:')
        || path.startsWith('//')
}

function renderUrl(url: string, data: {
    name: string
    version: string
    path: string
}) {
    const { path } = data
    if (isFullPath(path)
    ) {
        url = path
    }
    return url.replace(/\{name\}/g, data.name)
        .replace(/\{version\}/g, data.version)
        .replace(/\{path\}/g, path)
}

function PluginImportToCDN(options: Options): Plugin[] {

    const {
        modules = [],
        prodUrl = 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
    } = options

    let isBuild = false

    const data = modules.map((m) => {
        let v: Module
        if (typeof m === 'function') {
            v = m(prodUrl)
        } else {
            v = m
        }
        const version = getModuleVersion(v.name)
        let pathList: string[] = []
        if (Array.isArray(v.path)) {
            pathList = v.path
        } else if (v.path) {
            pathList.push(v.path)
        }

        const data = {
            ...v,
            version
        }

        pathList = pathList.map(p => {
            if (!version && !isFullPath(p)) {
                throw new Error(`modules: ${data.name} package.json file does not exist`)
            }
            return renderUrl(prodUrl, {
                ...data,
                path: p
            })
        })

        let css: string[] = []
        if (Array.isArray(v.css)) {
            css = v.css
        } else if (v.css) {
            css = [v.css]
        }

        const cssList = css.map(c => renderUrl(prodUrl, {
            ...data,
            path: c
        }))

        return {
            ...v,
            version,
            pathList,
            cssList
        }
    })

    const externalMap: {
        [name: string]: string
    } = {}

    data.forEach((v) => {
        if (v.var) {
            externalMap[v.name] = v.var
        }
    })

    const externalLibs = Object.keys(externalMap)

    const plugins: Plugin[] = [
        {
            name: 'vite-plugin-cdn-import',
            config(_, { command }) {
                // console.log('command', JSON.stringify(command))
                const userConfig: UserConfig = {
                    build: {
                        rollupOptions: {}
                    }
                }

                if (command === 'build') {
                    isBuild = true

                    userConfig!.build!.rollupOptions = {
                        external: [...externalLibs],
                        plugins: [externalGlobals(externalMap)]
                    }


                } else {
                    isBuild = false
                }

                return userConfig
            },
            transformIndexHtml(html) {
                const cssCode = data
                    .map(v => v.cssList.map(css => `<link href="${css}" rel="stylesheet">`).join('\n'))
                    .filter(v => v)
                    .join('\n')

                const jsCode = !isBuild
                    ? ''
                    : data
                        .map(p =>
                            p.pathList
                                .map(url => {
                                    if (p.esmodule) {
                                        return `<script type="module" src="${url}"></script>`
                                    }
                                    return `<script src="${url}"></script>`
                                }).join('\n')
                        ).join('\n')

                return html.replace(
                    /<\/title>/i,
                    `</title>${cssCode}\n${jsCode}`
                )
            },
        },
    ]
    // if (isBuild) {
    //     plugins.push(externalGlobals(externalMap))
    // }
    return plugins
}

export {
    PluginImportToCDN as Plugin,
    Options,
    autoComplete,
}

export default PluginImportToCDN
