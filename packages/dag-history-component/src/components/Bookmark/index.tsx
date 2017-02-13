import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classnames from 'classnames';
import * as state from '../../state';
import {default as DragDropBookmark, IDragDropBookmarkProps} from './DragDropBookmark';
import { connect } from 'react-redux';
import {
  bookmarkDragStart,
  bookmarkDragHover,
  bookmarkDragDrop,
  bookmarkDragCancel,
} from '../../state/actions/creators';
import { debounce } from 'lodash';

const {
  DragSource,
  DropTarget,
} = require('react-dnd');
const flow = require('lodash/flow');

const dragSource = {
  beginDrag(props: IDragDropBookmarkProps) {
    const { index, dispatch, stateId } = props;
    dispatch(bookmarkDragStart({ index, key: stateId }));
    return { index };
  },
  endDrag(props: IDragDropBookmarkProps, monitor, component) {
    const { dispatch } = props;
    const item = monitor.getItem();
    // TODO: use key instead for this?
    dispatch(bookmarkDragDrop({
      index: item.index,
      droppedOn: props.hoverIndex,
    }));
  },
};

const fireHoverEvent = debounce((dispatch, index) => dispatch(bookmarkDragHover({ index })));

const dropTargetSpec = {
  drop(props: IDragDropBookmarkProps, monitor, component) {
    const { index } = props;
    return { index };
  },
  hover(props: IDragDropBookmarkProps, monitor, component) {
    if (!monitor.isOver()) {
      return;
    }
    const {
      dispatch,
      index,
      hoverIndex,
      dragIndex,
      dragKey,
      stateId,
    } = props;

    if (dragKey === stateId) {
      return;
    }
    const domNode = ReactDOM.findDOMNode(component);
    const { clientWidth: width, clientHeight: height } = domNode;
    const rect = domNode.getBoundingClientRect();
    const clientY = monitor.getClientOffset().y;
    const midline = rect.top + ((rect.bottom - rect.top) / 2);
    const newHoverIndex = clientY < midline ? index : index + 1;

    if (newHoverIndex !== hoverIndex) {
      fireHoverEvent(dispatch, newHoverIndex);
    }
  }
};

const connectDragSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const connectDropTarget = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
});

export default flow(
  DragSource('BOOKMARK', dragSource, connectDragSource),
  DropTarget('BOOKMARK', dropTargetSpec, connectDropTarget),
  connect(),
)(DragDropBookmark);
