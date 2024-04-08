import React, { useCallback, useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"

const axios = require('axios')
axios.defaults.withCredentials = true

const Welcome = () => {
    const [userContext, setUserContext] = useContext(UserContext)

    const fetchUserDetails = useCallback(() => {
        axios.get(process.env.REACT_APP_API_URL + "/auth/user", {
            // Pass authentication token as bearer token in header
            headers: {
                Authorization: `Bearer ${userContext.token}`,
            },
        })
            .then(async response => {
                setUserContext(oldValues => {
                    return { ...oldValues, details: response.data }
                })
                if (response.ok) {

                } else {
                    if (response.status === 401) {
                        // Edge case: when the token has expired.
                        // This could happen if the refreshToken calls have failed due to network error or
                        // User has had the tab open from previous day and tries to click on the Fetch button
                        window.location.reload()
                    } else {

                    }
                }
            })
            .catch(errors => {
                setUserContext(oldValues => {
                    return { ...oldValues, details: null }
                })
            })
    }, [setUserContext, userContext.token])

    useEffect(() => {
        // fetch only when user details are not present
        if (!userContext.details) {
            fetchUserDetails()
        }
    }, [userContext.details, fetchUserDetails])

    const refetchHandler = () => {
        // set details to undefined so that spinner will be displayed and
        //  fetchUserDetails will be invoked from useEffect
        setUserContext(oldValues => {
            return { ...oldValues, details: undefined }
        })
    }

    return userContext.details === null ? (
        "Error Loading User details"
    ) : !userContext.details ? (
        console.log("cargando")
    ) : (
        <div className="user-details">
            <div>
                <p>
                    Welcome&nbsp;
                    <strong>
                        {userContext.details.firstName}
                        {userContext.details.lastName &&
                            " " + userContext.details.lastName}
                    </strong>!
                </p>
                <p>
                    Your reward points: <strong>{userContext.details.points}</strong>
                </p>
            </div>
            <div className="user-actions">
                <button type="button" class="btn btn-primary" onClick={refetchHandler} >Refetch</button>
            </div>
        </div>
    )
}

export default Welcome