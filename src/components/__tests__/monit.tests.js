import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Monit from '../Monit';
import { node } from '../__fixtures__/monit.tests';

describe("Monit", function() {

  test('Render the entire Monit', () => {
    const wrapper = shallow(
      <Monit
        node={node} />
    );
    const element = wrapper.find('.monit');
    expect(element.length).toBe(1);
  });

});
