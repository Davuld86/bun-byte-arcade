import React from 'react'

export default function EmbedGame({source}) {
  return (
        <iframe
        src={source}
        allowFullScreen='true'
        frameborder="0"
        >
        </iframe>
  )
}
