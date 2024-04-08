import React, { useContext, useState, useEffect } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import LoadModal from '../components/LoadModal'
import { UserContext } from "../context/UserContext"
const axios = require('axios')

const API_URL = process.env.REACT_APP_API_URL

const Register = () => {
    const [error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [userContext, setUserContext] = useContext(UserContext)
    const [fetchingData, setFetchingData] = useState(false)

    const formSubmitHandler = (e) => {
        e.preventDefault()
        setFetchingData(true)
        axios.post(API_URL + '/auth/register',
            { username, password, email, firstName, lastName }
        )
            .then((response) => {
                setUserContext(oldValues => {
                    return { ...oldValues, token: response.data.token }
                })
            })
            .catch((errors) => {
                setFetchingData(false)
                setError(errors.response.data.message)
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
                        <Form.Group className="mb-3">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control id="email" type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control id="firstName" type="text" placeholder="Nombre" onChange={e => setFirstName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control id="lastName" type="text" placeholder="Apellido" onChange={e => setLastName(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Registrarse
                        </Button>
                        <a href="/">
                            <button className="ms-3 btn btn-outline-success" type="button">
                                Iniciar Sesion
                            </button>
                        </a>
                    </Form>
                </div>
            </div>
        </div>
    )

}

export default Register