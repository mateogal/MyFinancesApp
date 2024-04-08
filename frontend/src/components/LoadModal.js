import React from 'react'
import Modal from 'react-bootstrap/Modal'

const LoadModal = () => {

    return (
        <div>
            <Modal show="true" centered contentClassName="bg-transparent loadmodal-zindex" backdropClassName="loadmodal-zindex" dialogClassName="loadmodal-zindex" keyboard={false} >
                <Modal.Body>
                    <div className="text-center">
                        <div className="spinner-border text-success" style={{ width: "5rem", height: "5rem" }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    )
}

export default LoadModal