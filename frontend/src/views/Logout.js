import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from "../context/UserContext"
const axios = require('axios')
const API_URL = process.env.REACT_APP_API_URL

const Logout = () => {
    const [userContext, setUserContext] = useContext(UserContext)

    axios.defaults.withCredentials = true
    axios.defaults.headers.common['Authorization'] = `Bearer ${userContext.token}`

    useEffect(() => {
        axios.get(API_URL + '/auth/logout')
            .then(response => {
                setUserContext(oldValues => {
                    return { ...oldValues, details: undefined, token: null }
                })
                window.localStorage.setItem("logout", Date.now())
            })
            .catch( errors => {
                errors = errors.toJSON()
                console.log(errors)
            })
    }, [])

    return (
        <>
        </>
    )

}

export default Logout