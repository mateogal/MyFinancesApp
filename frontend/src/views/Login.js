import React, { useContext, useState, useEffect } from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import LoadModal from '../components/LoadModal'
import { UserContext } from "../context/UserContext"
const axios = require('axios')

const API_URL = process.env.REACT_APP_API_URL

const Login = () => {
    const [error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userContext, setUserContext] = useContext(UserContext)
    const [fetchingData, setFetchingData] = useState(false)

    axios.defaults.withCredentials = true

    const formSubmitHandler = (e) => {
        e.preventDefault()
        setFetchingData(true)
        axios.post(API_URL + '/auth/login',
            { username, password }
        )
            .then((response) => {
                setUserContext(oldValues => {
                    return { ...oldValues, token: response.data.token }
                })
            })
            .catch((errors) => {
                setFetchingData(false)
                errors = errors.toJSON()
                if (errors.status === 400) {
                    setError("Por favor llene los campos correctamente.")
                } else if (errors.status === 401) {
                    setError("Usuario y/o contraseña inválidos.")
                } else {
                    setError("Algo ha salido mal. Intente de nuevo.")
                }
            })
    }

    useEffect( () => {
        document.body.style.setProperty("margin", "0", "important")
    }, [])

    return (
        <div className="container">
            { fetchingData && <LoadModal />}
            <div className="row vh-100 align-content-center justify-content-center">
                <div className="col-12 text-center">
                    <h3 className="text-uppercase">MyFinancesApp</h3>
                    <hr className="col-6 mx-auto text-white "></hr>
                </div>
                <div className="col-12 col-lg-5 bg-white text-dark shadow p-3 mt-5 bg-body rounded">
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <Form onSubmit={formSubmitHandler}>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control id="username" type="text" placeholder="Enter username" onChange={e => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control id="password" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Iniciar
                        </Button>
                        <a href="/register">
                            <button className="ms-3 btn btn-outline-success" type="button">
                                Registro
                            </button>
                        </a>
                    </Form>
                </div>
            </div>
        </div>
    )

}

export default Login