import React from 'react';
import { shallow } from 'enzyme';
import { SubNodes } from './SubNodes';

describe("SubNodes", function() {

  it('should render SubNodes component', () => {
    const component = shallow(<SubNodes />);
    expect(component).toMatchSnapshot();
  });

});
