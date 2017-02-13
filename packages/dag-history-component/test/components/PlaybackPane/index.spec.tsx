import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import PlaybackPane from '../../../src/components/PlaybackPane';

describe('The PlaybackPane Component', () => {
  it('can be mounted', () => {
    const rendered = mount(
      <PlaybackPane
        text="Hello!"
        depth={10}
        highlight={0}
        bookmarkDepth={1}
        bookmarkHighlight={0}
      />
    );
    const found = rendered.findWhere(it => it.text() === 'Hello!');
    expect(found.length).to.be.gte(1);
  });
});
