import React from 'react';
import { shallow } from 'enzyme';
import { SearchHeader } from './SearchHeader';

describe("SearchHeader", function() {

  it('should render SearchHeader component', () => {
    const component = shallow(<SearchHeader />);
    expect(component).toMatchSnapshot();
  });

});
