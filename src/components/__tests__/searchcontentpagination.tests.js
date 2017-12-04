import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import SearchContentPagination from '../SearchContentPagination';
import { nodes } from '../__fixtures__/searchcontentpagination.tests';


describe("SearchContentPagination", function() {

  test('Render SearchContentPagination page', () => {
    const wrapper = shallow(
      <SearchContentPagination
        nodes={nodes} />
    );
    const element = wrapper.find('.search-content-pagination');
    expect(element.length).toBe(1);
  });

});
