import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Info from '../Info';


describe("Info", function() {

  test('Render the entire Info', () => {
    const getNode = jest.fn((node, parentUuid) => {return true});
    const wrapper = shallow(
      <Info
        getNode={getNode} />
    );
    const element = wrapper.find('.info');
    expect(element.length).toBe(1);
  });

});
