import React from 'react';
import { shallow } from 'enzyme';
import { Query } from './Query';

describe("Query", function() {

  it('should render Query component', () => {
    const component = shallow(<Query />);
    expect(component).toMatchSnapshot();
  });

});
