import TestMenu from '../../utils/menuTree.json'
import { treeToPlan } from '@site/src/utils/menu'
import ReactDOMServer from 'react-dom/server'
import type { MenuItem, MenuList } from '@site/src/utils/menu'

/**
 *
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定的id | Permission judgment } id
 * @param anchor
 *
 */
export function check(id: number | string, anchor?: string): boolean {
    const menu: string | null = sessionStorage.getItem('menu')
    const pathMap: MenuList = treeToPlan(menu ? JSON.parse(menu) : TestMenu) || []
    const found = pathMap.find((item: MenuItem) => {
        return item.id === id
    })

    // 移除右侧锚点
    if (found == null) {
        setTimeout(() => {
            const href = anchor ? `#${anchor}` : `#${id}`
            const element = document.querySelector(`a[href="${href}"]`)
            element?.remove()
        })
    }

    return found != null
}

/**
 * 提取标题锚点
 */
export function regexAnchor(childrenRender: React.ReactNode) {
    const regex = /<(h1|h2|h3|h4|h5|h6) id="([^"]+)">/
    const reactString = ReactDOMServer.renderToString(childrenRender)
    let matches = regex.exec(reactString)
    return matches?.[2]
}
