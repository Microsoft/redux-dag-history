import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	decrement as doDecrement,
	increment as doIncrement,
	pickRandomColor as doPickRandomColor,
} from '../../state/Actions'

export interface VisualBStateProps {
	value: number
}

export interface VisualBDispatchProps {
	actions: {
		increment: Function
		decrement: Function
	}
}

export interface VisualBProps extends VisualBStateProps, VisualBDispatchProps {}

const RawVisualB: React.StatelessComponent<VisualBProps> = ({
	value,
	actions: { increment, decrement },
}) => (
	<div className="visual-b">
		<div>
			<h1>Value: {value}</h1>
		</div>
		<div>
			<button onClick={() => increment()}>Increment</button>
			<button onClick={() => decrement()}>Decrement</button>
		</div>
	</div>
)

export default connect<VisualBStateProps, VisualBDispatchProps, {}>(
	({ app: { current: { visuals: { value } } } }: any) => ({ value }),
	dispatch => ({
		actions: bindActionCreators(
			{
				increment: doIncrement,
				decrement: doDecrement,
			},
			dispatch,
		),
	}),
)(RawVisualB)
