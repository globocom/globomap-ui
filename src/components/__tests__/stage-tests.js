import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import sinon from "sinon";
import { shallow, mount, render } from 'enzyme';

import Stage from '../Stage';


describe("Stage", function() {

  test('Render the Stage', () => {
    const stageNodes = [];

    const wrapper = shallow(
      <Stage
        stageNodes={stageNodes} />
    );
    const p = wrapper.find('.stage-container');
    expect(p.text() === "");
  });

});
