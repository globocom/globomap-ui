import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Header from '../Header';


describe("Header", function() {

  test('Render the entire Header', () => {
    const graphs = [],
          collections = [];

    const wrapper = shallow(
      <Header
        graphs={graphs}
        collections={collections} />
    );
    const p = wrapper.find('.logo');
    expect(p.text() === "globo");
  });

});
