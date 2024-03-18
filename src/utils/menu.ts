export type MenuTypes = 'navbar' | 'sidebar' | 'category' | 'doc' | 'RoleRes'

export type MenuItem = {
    id: number
    title: string
    type: MenuTypes
    url?: string
    children?: MenuItem[]
}

export type MenuList = MenuItem[]

/**
 * 遍历菜单树或菜单数组
 * @param menu
 * @param callback
 */
export function loop(
    menu: MenuList,
    callback: (
        item: MenuItem,
        index: number,
        parent: MenuItem | undefined,
        arr: MenuItem[]
    ) => boolean | void
): MenuList {
    let shouldStop: boolean = false
    function doEach(data: MenuList, parent?: MenuItem) {
        for (let i = 0; i < data.length; i++) {
            if (shouldStop) break
            const item = data[i]
            const rs = callback(item, i, parent, data)
            if (rs === false) {
                shouldStop = true
                break
            }
            if (item.children) {
                doEach(item.children, item)
            }
        }
    }

    doEach(menu)
    return menu
}

/**
 * 将菜单树展开为平面数组
 * @param menus
 */
export function treeToPlan(menus: MenuList): MenuList {
    const list: MenuList = []
    loop(menus, (item) => {
        const cloneItem = cloneDeep(item)
        delete cloneItem.children
        list.push(cloneItem)
    })
    return list
}

/**
 * 获取两个树的差异
 * @param menuOne
 * @param menuTwo
 */
export function diffToMenu(menuOne: MenuList, menuTwo: MenuList): MenuList {
    const planOne: any[] = treeToPlan(menuOne)
    const planTwo: any[] = treeToPlan(menuTwo)
    const diff: MenuList = ([] = planOne.filter(
        (item1) => !planTwo.find((item2) => item1.id === item2.id)
    ))
    return diff
}

function cloneDeep(element: any) {
    const newElement = JSON.parse(JSON.stringify(element))
    return newElement
}
