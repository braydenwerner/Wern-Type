import React, { useRef, useState, useEffect } from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { pageState, signedInState } from '../../recoil'
import { app, auth, db } from '../../firebase'
import './Profile.scss'
import AnimatedHeader from '../AnimatedHeader/AnimatedHeader'

export default function Profile() {
  const signinRefEmail = useRef(null)
  const signinRefPassword = useRef(null)
  const signupRefEmail = useRef(null)
  const signupRefPassword = useRef(null)

  const currentPageState = useRecoilValue(pageState)
  const [signedIn, setSignedIn] = useRecoilState(signedInState)

  const [errorMessage, setErrorMessage] = useState('')
  const [docData, setDocData] = useState({})

  const signIn = (e) => {
    e.preventDefault()
    auth
      .signInWithEmailAndPassword(
        signinRefEmail.current.value,
        signinRefPassword.current.value
      )
      .catch((error) => {
        setErrorMessage(error.message)
      })
  }

  //  sign up, add defaul values to database
  const signUp = (e) => {
    e.preventDefault()
    const email = signupRefEmail.current.value

    auth
      .createUserWithEmailAndPassword(email, signupRefPassword.current.value)
      .then(() => {
        db.collection('users')
          .doc(email)
          .set({
            email: email,
            bestWPM: 0,
            avgWPM: 0
          })
          .catch((error) => {
            setErrorMessage(error.message)
          })
      })
      .catch((error) => {
        setErrorMessage(error.message)
      })
  }

  const signOut = () => {
    auth.signOut().catch((error) => {
      setErrorMessage(error.message)
    })
  }

  //  detects sign in, sign out. retrieves data and runs setDocData() to render
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setErrorMessage('')
        setSignedIn(true)

        const docRef = db.collection('users').doc(user.email)
        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              setDocData({
                email: user.email,
                ...doc.data()
              })
            }
          })
          .catch((error) => {
            setErrorMessage(error.message)
          })
      } else {
        setSignedIn(false)
      }
    })
  }, [])

  //  contains nested component AnimatedHeader
  return (
    <div id="outer-profile-container">
      {currentPageState === 'profileState' && (
        <div id="outer-stats-container">
          {errorMessage === '' && signedIn && (
            <div id="inner-stats-container">
              <AnimatedHeader text="Profile" />
              <h1>{docData.email}</h1>
              <h2>Average WPM (All time): {docData.avgWPM}</h2>
              <h2>Fastest Race: {docData.bestWPM}</h2>
              <button onClick={signOut}>Sign out</button>
            </div>
          )}
          {!signedIn && (
            <div id="outer-form-signin">
              <form id="signin-container">
                <input
                  type="text"
                  placeholder="email"
                  required
                  ref={signinRefEmail}
                />
                <input
                  type="text"
                  placeholder="password"
                  required
                  ref={signinRefPassword}
                />
                <button type="login-input-button" onClick={signIn}>
                  Login
                </button>
              </form>

              <form id="signup-container">
                <input
                  type="text"
                  placeholder="email"
                  required
                  ref={signupRefEmail}
                />
                <input
                  type="text"
                  placeholder="password"
                  required
                  ref={signupRefPassword}
                />
                <button type="submit" onClick={signUp}>
                  Sign Up
                </button>
              </form>
              <div id="error-container">
                {errorMessage !== '' && (
                  <div id="error-message">{errorMessage}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}