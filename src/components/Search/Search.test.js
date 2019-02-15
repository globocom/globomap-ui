import React from 'react';
import { shallow } from 'enzyme';
import { Search } from './Search';

describe("Search", function() {

  it('should render Search component', () => {
    const component = shallow(<Search />);
    expect(component).toMatchSnapshot();
  });

});
