import {
	addBookmark,
	doChangeBookmark,
	moveBookmark,
	removeBookmark,
	renameBookmark,
} from '../../../src/state/actions/creators'
import reduce from '../../../src/state/reducers/bookmarks'

const fan = bookmarks => bookmarks.map(b => b.stateId)

describe('The bookmarks reducer', () => {
	it('emits an empty bookmarks array by default', () => {
		expect(reduce(undefined, { type: 'derp' })).toEqual([])
	})

	it('can add a bookmark', () => {
		const state = reduce(undefined, addBookmark({ stateId: 1, name: 'derp' }))
		expect(state).toEqual([{ stateId: 1, name: 'derp', data: {} }])
	})

	it('can add a bookmark with data', () => {
		const state = reduce(
			undefined,
			addBookmark({ stateId: 1, name: 'derp', data: { x: 1 } }),
		)
		expect(state).toEqual([{ stateId: 1, name: 'derp', data: { x: 1 } }])
	})

	it('can remove a bookmark', () => {
		let state
		state = reduce(state, addBookmark({ stateId: 1, name: 'state1' }))
		state = reduce(state, addBookmark({ stateId: 2, name: 'state2' }))
		state = reduce(state, addBookmark({ stateId: 3, name: 'state3' }))

		expect(state.length).toEqual(3)

		state = reduce(state, removeBookmark(2))
		expect(state.length).toEqual(2)
		expect(fan(state)).toEqual([1, 3])
	})

	it('can rename a bookmark', () => {
		let state
		state = reduce(state, addBookmark({ stateId: 1, name: 'state1' }))
		state = reduce(state, addBookmark({ stateId: 2, name: 'state2' }))
		state = reduce(state, addBookmark({ stateId: 3, name: 'state3' }))

		state = reduce(state, renameBookmark({ stateId: 2, name: 'newName' }))
		expect(state[1].name).toEqual('newName')
	})

	it('can change a bookmark', () => {
		let state
		state = reduce(state, addBookmark({ stateId: '1', name: 'state1' }))
		state = reduce(state, addBookmark({ stateId: '2', name: 'state2' }))
		state = reduce(state, addBookmark({ stateId: '3', name: 'state3' }))

		state = reduce(
			state,
			doChangeBookmark({ stateId: '2', name: 'newName', data: { x: 1 } }),
		)
		expect(state[1].name).toEqual('newName')
		expect(state[1].data).toEqual({ x: 1 })
	})

	it('can move a bookmark', () => {
		let state
		state = reduce(state, addBookmark({ stateId: '1', name: 'state1' }))
		state = reduce(state, addBookmark({ stateId: '2', name: 'state2' }))
		state = reduce(state, addBookmark({ stateId: '3', name: 'state3' }))

		state = reduce(state, moveBookmark({ from: 0, to: 2 }))
		expect(fan(state)).toEqual(['2', '3', '1'])

		state = reduce(state, moveBookmark({ from: 0, to: 1 }))
		expect(fan(state)).toEqual(['3', '2', '1'])

		state = reduce(state, moveBookmark({ from: 2, to: 1 }))
		expect(fan(state)).toEqual(['3', '1', '2'])

		state = reduce(state, moveBookmark({ from: 2, to: 0 }))
		expect(fan(state)).toEqual(['2', '3', '1'])
	})
})
