import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Properties from '../Properties';
import { item } from '../__fixtures__/properties.tests';


describe("Properties", function() {

  test('Render Properties page', () => {
    const wrapper = shallow(
      <Properties
        item={item} />
    );
    const element = wrapper.find('.item-prop');
    expect(element.length).toBe(1);
  });

});
