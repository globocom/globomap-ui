import React from 'react';
import { shallow } from 'enzyme';
import { User } from './User';

describe("User", function() {

  it('should render User component', () => {
    const component = shallow(<User />);
    expect(component).toMatchSnapshot();
  });

});
