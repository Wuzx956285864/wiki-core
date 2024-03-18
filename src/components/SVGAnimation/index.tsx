import React, { useState, useEffect, useRef } from 'react'
import xmldoc from 'xmldoc'
import camelCase from 'lodash/camelCase'
import type { HTMLAttributes } from 'react'
import type { SVGTypes } from 'xmldoc'

export interface SVGAnimationProps extends Omit<HTMLAttributes<SVGElement>, 'onLoad' | 'onError'> {
    type: keyof typeof SVGTypes
    loadingContent?: React.ReactNode
    onLoad?: () => void
    onError?: (err: Error) => void
}
interface SVGInfo {
    svg: xmldoc.XmlDocument
    script: string
}
async function loadSVG(type: SVGAnimationProps['type']): Promise<SVGInfo> {
    return await import(`raw-loader!@site/static/img/${type}.xsvg`).then((res) => {
        const script = {
            content: '',
            index: -1,
        }
        const str = res.default
        const doc = new xmldoc.XmlDocument(str)
        // Extract script
        doc.eachChild((child: { name: string; val: string }, index: number) => {
            if (child.name === 'script') {
                script.content = child.val
                script.index = index
            }
        })
        if (script.index > -1) doc.children.splice(script.index, 1)
        return {
            svg: doc,
            script: script.content,
        }
    })
}

export default function SVGAnimation(props: SVGAnimationProps) {
    const { type, loadingContent = null, onLoad, onError, ...rest } = props
    const [content, setContent] = useState<React.ReactNode>(loadingContent)
    const scriptRef = useRef<HTMLScriptElement>()

    useEffect(() => {
        loadSVG(type).then(({ svg, script }) => {
            const content: string[] = []
            svg.eachChild((child: { toString: () => string }) => {
                content.push(child.toString())
            })
            const key = 'svg-animation' + (svg.attr.id || (Math.random() * 10000).toFixed(0))
            const svgAttr = {}
            Object.keys(svg.attr).forEach((key) => {
                svgAttr[camelCase(key)] = svg.attr[key]
            })
            const svgElement = React.createElement('svg', {
                key,
                ...rest,
                ...svgAttr,
                dangerouslySetInnerHTML: { __html: content.join('\n') },
            })
            setContent(svgElement)
            const scriptElement = document.createElement('script')
            scriptElement.id = key
            scriptElement.innerHTML = script
            document.body.append(scriptElement)
            scriptRef.current = scriptElement
            onLoad?.()
        }, onError)
        return () => {
            if (scriptRef.current) document.body.removeChild(scriptRef.current)
        }
    }, [type])
    return <>{content}</>
}
