import React from 'react';
import { shallow } from 'enzyme';
import { SearchContentPagination } from './SearchContentPagination';

describe("SearchContentPagination", function() {

  it('should render SearchContentPagination component', () => {
    const component = shallow(<SearchContentPagination />);
    expect(component).toMatchSnapshot();
  });

});
