import React from 'react';
import ReactDOM from 'react-dom';
import {unmountComponentAtNode} from "react-dom";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import sinon from "sinon";
import { shallow, mount, render } from 'enzyme';

import ByGraph from '../ByGraph';
import { items, graphs } from '../__fixtures__/bygraph.tests';


describe("ByGraph", function() {

  test('Render the ByGraph box', () => {
    const wrapper = shallow(
      <ByGraph
        items={items}
        graphs={graphs} />
    );
    const element = wrapper.find('.sub-nodes-by-graph');
    expect(element.length).toEqual(0);
  });

});
