import React from 'react'

const FormModal = (props) => {

    return (
        <>
            <div className="modal fade" id={props.id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={props.id} aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header text-bg-dark">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">{props.title}</h1>
                            <button type="button" className="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-bg-dark">
                            <form>
                                <div className="mb-3 row g-2 row-cols-1 row-cols-md-2">
                                    {
                                        props.inputs.map((input) => {
                                            return (
                                                <div key={input.id} className="col">
                                                    <div className="form-floating">
                                                        <input type={input.type} className="form-control" id={input.id} placeholder={input.label} disabled={input.disabled} min="0" required/>
                                                        <label className="text-dark" htmlFor={input.id} >{input.label}</label>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        props.selects.map((select) => {
                                            return (
                                                <div key={select.id} className="form-floating">
                                                    <select className="form-select" id={select.id} disabled={select.disabled} onChange={select.eventChange ? select.eventChange : undefined} required>
                                                        <option></option>
                                                        {select.options.map((option) => {
                                                            return (
                                                                <option key={option.value} value={option.value}>{option.text}</option>
                                                            )
                                                        })}
                                                    </select>
                                                    <label className="text-dark" htmlFor={select.id}>{select.label}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer text-bg-dark">
                            <button id={props.buttonId} type="button" className="btn btn-primary" onClick={props.buttonHandle}>Ingresar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default FormModal