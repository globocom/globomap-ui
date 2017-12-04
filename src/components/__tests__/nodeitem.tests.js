'use strict';

import React from 'react';
import {unmountComponentAtNode} from "react-dom";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import sinon from "sinon";
import { shallow, mount, render } from 'enzyme';

import NodeItem from '../NodeItem';
import { node } from '../__fixtures__/nodeitem.tests';


describe("NodeItem", function() {

  // jest.useFakeTimers();
  let clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers()
  });

  afterEach(function () {
    clock.restore()
    unmountComponentAtNode(document);
    document.body.innerHTML = "";
  });

  test('Render NodeItem page', () => {
    const wrapper = shallow(
      <NodeItem
        node={node} />
    );
    const element = wrapper.find('.node-item');
    expect(element.length).toBe(1);
  });

});
