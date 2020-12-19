import React from 'react'
import {
  TypingForm,
  Keyboard,
  Restart,
  Nav,
  Profile
} from './Components/exports'
import './App.scss'

function App() {
  return (
    <>
      <Nav />
      <div id="outer-component-container">
        <TypingForm />
        <Keyboard />
        <Profile />
        <Restart />
      </div>
    </>
  )
}

export default App
