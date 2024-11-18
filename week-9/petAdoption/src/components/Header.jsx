import React from 'react'

const Header = ({ message }) => {
  return (
    <div style={{ padding: 20, backgroundColor: "rgba(128, 71, 28, 0.5)" }}>
      <h1>{message}</h1>
    </div>
  )
}

export default Header
