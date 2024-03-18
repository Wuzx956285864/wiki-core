import React from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import './styles.css'

export default function ImageZoom({ src, ...style }) {
    return (
        <Zoom>
            <img src={src} {...style} />
        </Zoom>
    )
}
