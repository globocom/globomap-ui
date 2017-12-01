import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import NodeEdges from '../NodeEdges';


describe("NodeEdges", function() {

  test('Render NodeEdges page', () => {
    const wrapper = shallow(
      <NodeEdges />
    );
    const element = wrapper.find('.sub-node-edges');
    expect(element.length).toBe(1);
  });

});
