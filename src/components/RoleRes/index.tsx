import React from 'react'
import { check, regexAnchor } from './CheckPermissions'
import BrowserOnly from '@docusaurus/BrowserOnly'
import type { PropsWithChildren } from 'react'

type AuthorizedProps = {
    id: string
    title?: string
    noMatch?: React.ReactNode
}

/**
 * 权限包装器，如果有权限才会渲染children，没有则显示noMatch或不显示
 * @param props
 * @constructor
 */
const RoleRes = (props: PropsWithChildren<AuthorizedProps>) => {
    const { children, id = 'auth', noMatch = null, title } = props
    const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children
    const anchor = regexAnchor(childrenRender)

    return (
        <div data-roleres={id} data-title={title || anchor}>
            <BrowserOnly>
                {() => {
                    const hasAuth = check(id, anchor)
                    return <>{hasAuth ? childrenRender : noMatch}</>
                }}
            </BrowserOnly>
        </div>
    )
}

/**
 * 权限检测函数 CheckPermissions
 */
RoleRes.check = check

export default RoleRes
