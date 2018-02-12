import { DagGraph, DagHistory } from '@essex/redux-dag-history'
import * as debug from 'debug'
import * as React from 'react'
import isNumber from '../../util/isNumber'
import PlaybackPane from '../PlaybackPane'
import Transport from '../Transport'
import makeActions from '../../util/BookmarkActions'
import HistoryTabs from '../HistoryTabs'
import SwitchingHistoryView from './SwitchingHistoryView'
import BookmarkHelper from '../../util/Bookmark'
import { HistoryContainerSharedProps } from './interfaces'
import { Bookmark } from '../../interfaces'
import StoryboardingView from '../StoryboardingView'
import '../../../styles.css'
import { PlaybackContainer } from './styled'
const log = debug('dag-history-component:components:History')

export interface HistoryDispatchProps {
	onLoad?: Function
	onClear?: Function
	onSelectMainView?: (view: string) => any
	onToggleBranchContainer?: Function
	onStartPlayback?: Function
	onStopPlayback?: Function
	onSelectBookmarkDepth?: Function
	onSelectState?: Function
}

export interface HistoryProps
	extends HistoryContainerSharedProps,
		HistoryDispatchProps {}

export default class History extends React.Component<HistoryProps, {}> {
	public shouldComponentUpdate(nextProps: HistoryProps) {
		return this.props !== nextProps
	}

	public onSaveClicked() {
		const { history, controlBar: { onSaveHistory }, bookmarks } = this.props
		const { current, graph } = history
		// Pass the plain history up to the client to save
		onSaveHistory({
			current,
			lastBranchId: graph.get('lastBranchId'),
			lastStateId: graph.get('lastStateId'),
			bookmarks,
			graph: graph.toJS(),
		})
	}

	public async onLoadClicked() {
		log('history load clicked')
		const { onLoad, controlBar: { onLoadHistory } } = this.props
		if (!onLoadHistory) {
			throw new Error("Cannot load history, 'onLoadHistory' must be defined")
		}
		const state = await onLoadHistory()
		if (!state) {
			throw new Error(
				"'onLoadHistory' must return either a state graph object or a promise that resolves to a state graph object",
			)
		}
		onLoad(state)
	}

	public async onClearClicked() {
		const { onClear, controlBar: { onConfirmClear } } = this.props
		log('clearing history')
		const doConfirm = onConfirmClear || (() => true)
		const confirmed = await doConfirm()
		return confirmed && onClear()
	}

	public renderPlayback() {
		const {
			history,
			onStartPlayback,
			onStopPlayback,
			selectedBookmark,
			selectedBookmarkDepth,
			onSelectBookmarkDepth,
			onSelectState,
			bookmarks,
		} = this.props

		const { graph } = history
		const historyGraph = new DagGraph(graph)
		const bookmark = bookmarks[selectedBookmark]
		const slideText =
			bookmark.data.annotation || bookmark.name || 'No Slide Data'
		const numLeadInStates = bookmark.data.numLeadInStates
		const bookmarkPath = historyGraph.shortestCommitPath(bookmark.stateId)

		const {
			handleStepBack,
			handleStepForward,
			handleNextBookmark,
			handlePreviousBookmark,
			handleStepBackUnbounded,
		} = makeActions(
			selectedBookmark,
			selectedBookmarkDepth,
			history,
			bookmarks,
			onSelectBookmarkDepth,
		)

		const bookmarkHighlight =
			selectedBookmarkDepth !== undefined
				? selectedBookmarkDepth
				: bookmarkPath.length - 1

		const initialDepth = new BookmarkHelper(
			bookmarks[0],
			new DagGraph(history.graph),
		).startingDepth()

		// End the presentation if we're on the last slide
		return (
			<PlaybackContainer>
				<PlaybackPane
					text={slideText}
					depth={bookmarks.length}
					highlight={selectedBookmark}
					bookmarkDepth={bookmarkPath.length}
					bookmarkHighlight={bookmarkHighlight}
					bookmarkNumLeadInStates={numLeadInStates}
					onDiscoveryTrailIndexClicked={(selectedIndex: number) => {
						const target = bookmarkPath[selectedIndex]
						onSelectBookmarkDepth({
							target,
							depth: selectedIndex,
							state: target,
						})
						onSelectState(target)
					}}
				/>
				<Transport
					playing={true}
					onStepBack={handleStepBackUnbounded}
					onStepForward={handleStepForward}
					onBack={handleStepBack}
					onForward={handleStepForward}
					onPlay={() => onStartPlayback({ initialDepth })}
					onStop={onStopPlayback}
				/>
			</PlaybackContainer>
		)
	}

	public render() {
		const {
			mainView,
			onSelectMainView,
			bookmarksEnabled,
			isPlayingBack,
			controlBar,
		} = this.props
		return isPlayingBack ? (
			this.renderPlayback()
		) : (
			<HistoryTabs
				bookmarksEnabled={bookmarksEnabled}
				controlBarEnabled={!!controlBar}
				selectedTab={mainView}
				onTabSelect={onSelectMainView}
				historyView={<SwitchingHistoryView {...this.props} />}
				storyboardingView={
					<StoryboardingView
						{
							...this.props as any /* TODO: Fix this, shouldn't cast to any*/
						}
					/>
				}
				onSaveClicked={() => this.onSaveClicked()}
				onLoadClicked={() => this.onLoadClicked()}
				onClearClicked={() => this.onClearClicked()}
			/>
		)
	}
}
