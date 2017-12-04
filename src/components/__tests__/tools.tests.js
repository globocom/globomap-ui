import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Tools from '../Tools';


describe("Tools", function() {

  test('Render Tools page', () => {
    const stageNodes = []
    const wrapper = shallow(
      <Tools
      stageNodes={stageNodes} />
    );
    const element = wrapper.find('.tools');
    expect(element.length).toEqual(1);
  });

});
