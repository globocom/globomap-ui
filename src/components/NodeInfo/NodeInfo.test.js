import React from 'react';
import { shallow } from 'enzyme';
import { NodeInfo } from './NodeInfo';

describe("NodeInfo", function() {
  it('should render NodeInfo component', () => {
    const component = shallow(<NodeInfo />);
    expect(component).toMatchSnapshot();
  });
});
