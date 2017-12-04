import React from 'react';
// import { MemoryRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import NotFound from '../NotFound';


describe("NotFound", function() {

  test('Render NotFound page', () => {
    const wrapper = shallow(
      <NotFound />
    );
    const element = wrapper.find('.status');
    expect(element.text()).toEqual('404');
  });

});
