import React from 'react';
import { shallow } from 'enzyme';
import { NodeEdges } from './NodeEdges';

describe("NodeEdges", function() {

  it('should render NodeEdges component', () => {
    const component = shallow(<NodeEdges />);
    expect(component).toMatchSnapshot();
  });

});
