import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import PopMenu from '../PopMenu';


describe("PopMenu", function() {

  test('Render PopMenu page', () => {
    const wrapper = shallow(
      <PopMenu />
    );
    const element = wrapper.find('.popmenu');
    expect(element.length).toBe(1);
  });

});
