import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import InfoContentHead from '../InfoContentHead';


describe("InfoContentHead", function() {

  test('Render the entire InfoContentHead', () => {
    const node = false;
    const wrapper = shallow(
      <InfoContentHead
        node={node} />
    );
    const element = wrapper.find('.info-content-head');
    expect(element.length).toBe(1);
  });

});
