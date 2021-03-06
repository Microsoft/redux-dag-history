import { StateId, DagGraph } from '@essex/redux-dag-history'
import * as debug from 'debug'
import { Bookmark as BookmarkData } from '../interfaces'
import Bookmark from './Bookmark'

const log = debug('dag-history-component:BookmarkActions')

export default function makeActions(
	rawSelectedBookmark: number,
	rawSelectedBookmarkDepth: number,
	history: any,
	bookmarks: BookmarkData[],
	onSelectBookmarkDepth: Function,
) {
	const graph = new DagGraph(history.graph)
	const { currentStateId } = graph
	const bookmarkAt = (index: number) => {
		if (bookmarks.length === 0 || index < 0 || index >= bookmarks.length) {
			return null
		}
		return new Bookmark(bookmarks[index], graph)
	}
	const jump = (index: number, jumpToDepth?: number) => {
		const target: Bookmark = bookmarkAt(index)
		const state: StateId = target.getStateAtDepth(jumpToDepth)
		onSelectBookmarkDepth({ bookmarkIndex: index, depth: jumpToDepth, state })
	}
	const bookmarkIndex =
		rawSelectedBookmark !== undefined
			? rawSelectedBookmark
			: Math.max(0, bookmarks.findIndex(it => it.stateId === currentStateId))
	const bookmark: Bookmark = bookmarkAt(bookmarkIndex)
	const depth = bookmark
		? bookmark.sanitizeDepth(rawSelectedBookmarkDepth)
		: null

	const rawStepBack = (isAtBookmarkStart: boolean) => {
		const isAtBeginning = bookmarkIndex === 0 && isAtBookmarkStart

		// We're at the start of the presentation, do nothing
		if (isAtBeginning) {
			return
		}

		if (isAtBookmarkStart) {
			log('going to previous bookmark')
			jump(bookmarkIndex - 1, undefined)
			return
		}

		log('decrementing depth in current bookmark')
		jump(bookmarkIndex, depth - 1)
	}

	const handleStepForward = () => {
		const isAtBookmarkEnd = bookmark.isDepthAtEnd(depth)
		const isAtLastBookmark = bookmarkIndex === bookmarks.length - 1
		const isAtEnd = isAtLastBookmark && isAtBookmarkEnd

		// We're at the end of the presentation, do nothing
		if (isAtEnd) {
			return
		}

		// If we're not at the end of this bookmark, just increment the step
		if (!isAtBookmarkEnd) {
			log('incrementing depth in current bookmark')
			jump(bookmarkIndex, depth + 1)
			return
		}

		// Go to the start of the next bookmark
		log('going to next bookmark')
		const nextBookmark = new Bookmark(bookmarks[bookmarkIndex + 1], graph)
		jump(bookmarkIndex + 1, nextBookmark.startingDepth())
	}

	const handleStepBack = () => rawStepBack(bookmark.isDepthAtStart(depth))
	const handleStepBackUnbounded = () => rawStepBack(depth === 0)
	const handleJumpToBookmark = (index: number) => jump(index)
	const handlePreviousBookmark = () =>
		handleJumpToBookmark(Math.max(bookmarkIndex - 1, 0))
	const handleNextBookmark = () =>
		handleJumpToBookmark(Math.min(bookmarkIndex + 1, bookmarks.length - 1))

	return {
		handleStepBack,
		handleStepForward,
		handleNextBookmark,
		handlePreviousBookmark,
		handleStepBackUnbounded,
	}
}
