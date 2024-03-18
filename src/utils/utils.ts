const menuTree = require('./menuTree.json')
const routesTree = require('../../docusaurus.config.d/routes')
import { diffToMenu } from './menu'
import './historyMethod'

const flattenArray = (arr: any[]): any[] => {
    let result: any[] = []
    arr.forEach((obj) => {
        result.push(obj)
        if (obj.children) {
            result = result.concat(flattenArray(obj.children))
            delete obj.children
        }
    })
    return result
}

function onLoad(): void {
    if (typeof window === 'undefined') return

    const loader: HTMLDivElement = document.createElement('div')
    loader.className = 'loader'
    document.body.appendChild(loader)

    setTimeout(() => {
        const menu = sessionStorage.getItem('menu')
        const diffData = diffToMenu(routesTree, menu ? JSON.parse(menu) : menuTree)
        if (!menu) {
            sessionStorage.setItem('menu', JSON.stringify(menuTree))
        }
        diffData.forEach((item: any) => {
            const className: string = `docs-doc-id-${item.id}`
            const elements: HTMLCollectionOf<Element> = document.getElementsByClassName(className)
            if (elements.length > 0) {
                Array.prototype.forEach.call(elements, (element: Element) => {
                    element.remove()
                })
            }
        })
        loader.style.display = 'none'
    }, 100)
}

function handleRouteChange(): void {
    const loadMap: string[] = menuTree.map((item: { url?: string }) => {
        return item.url
    })
    loadMap.unshift('/docs/')
    const storage_path: string | null = sessionStorage.getItem('current_path')
    const current_path: string = window.location.pathname

    if (storage_path !== current_path && loadMap.includes(current_path)) {
        onLoad()
    }
    sessionStorage.setItem('current_path', window.location.pathname)
}

if (typeof window !== 'undefined') {
    window.addHistoryListener('history', handleRouteChange)
    window.addEventListener('popstate', () => handleRouteChange())
    window.onload = () => onLoad()
}
