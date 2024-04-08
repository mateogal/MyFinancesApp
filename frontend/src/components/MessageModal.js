import React from 'react'
import Modal from 'react-bootstrap/Modal'

class MessageModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            show: true
        })
    }

    componentDidMount() {
        this.setState({
            border: "border border-"+this.props.type,
            alert: "alert alert-"+this.props.type
        })
    }

    handleClose = () => {
        this.props.onClose()
        this.setState({ show: false })
    }

    render() {
        return (
            <div>
                <Modal dialogClassName={this.state.border} show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header className="bg-dark text-white" closeButton closeVariant='white'>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-white">
                        {
                            this.props.body.map((message) => {
                                return (
                                    <div key={message} className={this.state.alert} role="alert">
                                        {message}
                                    </div>
                                )

                            })
                        }
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default MessageModal