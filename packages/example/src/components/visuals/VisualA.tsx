import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	decrement as doDecrement,
	increment as doIncrement,
	pickRandomColor as doPickRandomColor,
} from '../../state/Actions'

export interface VisualAStateProps {
	backgroundColor: string
}

export interface VisualADispatchProps {
	actions: {
		pickRandomColor: Function
	}
}

export interface VisualAProps extends VisualAStateProps, VisualADispatchProps {}

const RawVisualA: React.StatelessComponent<VisualAProps> = ({
	backgroundColor,
	actions: { pickRandomColor },
}) => (
	<div
		className="visual-a"
		style={{ backgroundColor }}
		onClick={() => pickRandomColor()}
	>
		<h1>Color: {backgroundColor}</h1>
	</div>
)

export default connect<VisualAStateProps, VisualADispatchProps, {}>(
	({ app: { current: { visuals: { color: backgroundColor } } } }: any) => ({
		backgroundColor,
	}),
	dispatch => ({
		actions: bindActionCreators(
			{ pickRandomColor: doPickRandomColor },
			dispatch,
		),
	}),
)(RawVisualA)
