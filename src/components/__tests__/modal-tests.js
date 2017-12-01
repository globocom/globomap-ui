import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Modal from '../Modal';


describe("Modal", function() {

  test('Render the entire Modal', () => {
    const wrapper = shallow(
      <Modal
        visible="true" />
    );
    const element = wrapper.find('.modal');
    expect(element.length).toBe(1);
  });

});
