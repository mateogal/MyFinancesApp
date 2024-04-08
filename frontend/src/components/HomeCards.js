import React from 'react'

const Cards = (props) => {
	return (
		<div className="card border-primary h-100">
			<div className="card-header bg-primary text-center text-uppercase">
				<h5>{props.title}</h5>
			</div>
			<div className="card-body bg-dark-blue text-center">
				<h6 id={props.bodyId} className="text-success fw-bolder">{props.body}</h6>
			</div>
			{(props.footerId) && 
				<div className="card-footer bg-dark-light text-center p-1">
					{props.footerText}
					<label id={props.footerId}></label>
				</div>
			}
	 	</div>
	)
}

export default Cards