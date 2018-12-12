import React from 'react';
import { shallow } from 'enzyme';
import { NotFound } from './NotFound';

describe("NotFound", function() {

  it('should render NotFound component', () => {
    const component = shallow(<NotFound />);
    expect(component).toMatchSnapshot();
  });

});
