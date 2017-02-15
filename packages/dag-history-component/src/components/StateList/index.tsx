import * as React from 'react';
import State from '../State';
import isNumber from '../../util/isNumber';
import { IStateProps } from '../State/interfaces';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export interface IStateListProps {
  states: IStateProps[];
  activeStateId?: number;
  onStateClick?: Function;
  onStateContinuationClick?: Function;
  renderBookmarks?: boolean;
  onStateBookmarkClick?: Function;
}

export interface IStateListState {
}

export default class StateList extends React.Component<IStateListProps, IStateListState> {
  private containerDiv: HTMLDivElement;

  static propTypes = {
    states: React.PropTypes.arrayOf(React.PropTypes.shape(State.propTypes)).isRequired,
    activeStateId: React.PropTypes.number,
    onStateClick: React.PropTypes.func,
    onStateContinuationClick: React.PropTypes.func,
    renderBookmarks: React.PropTypes.bool,
    onStateBookmarkClick: React.PropTypes.func,
  };

  public componentDidUpdate() {
    this.containerDiv.scrollTop = this.containerDiv.scrollHeight;
  }

  public render() {
    const {
      states,
      activeStateId,
      onStateClick,
      onStateContinuationClick,
      renderBookmarks,
      onStateBookmarkClick,
    } = this.props;

    const handleClick = (id) => {
      if (onStateClick) {
        onStateClick(id);
      }
    };

    const handleContinuationClick = (id) => {
      if (onStateContinuationClick) {
        onStateContinuationClick(id);
      }
    };

    const handleBookmarkClick = (id) => {
      if (onStateBookmarkClick) {
        onStateBookmarkClick(id);
      }
    };

    const stateViews = states.map((s, index) => (
      <State
        {...s}
        {...{ renderBookmarks }}
        key={s.id}
        active={isNumber(activeStateId) && s.id === activeStateId}
        onClick={(id) => handleClick(id)}
        onContinuationClick={(id) => handleContinuationClick(id)}
        onBookmarkClick={(id) => handleBookmarkClick(id)}
      />
    ));
    return (
      <div
        ref={(e) => (this.containerDiv = e)}
        className="state-list-container"
      >
        <ReactCSSTransitionGroup
          transitionName="state-entry"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          {stateViews}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
