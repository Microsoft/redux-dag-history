import { storiesOf } from '@storybook/react'
import * as React from 'react'
import DiscoveryTrail from '../../../src/components/DiscoveryTrail'
const { action } = require('@storybook/addon-actions')

storiesOf('DiscoveryTrail', module)
	.add('Horizontal', () => <DiscoveryTrail depth={10} highlight={8} />)
	.add('Horizontal, Full-Width', () => (
		<DiscoveryTrail depth={0} highlight={0} />
	))
	.add('Vertical', () => (
		<div style={{ height: 300, display: 'flex' }}>
			<DiscoveryTrail vertical={true} depth={10} highlight={8} />
			<div style={{ flex: 2 }} />
		</div>
	))
