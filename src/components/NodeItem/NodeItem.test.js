import React from 'react';
import { shallow } from 'enzyme';
import { NodeItem } from './NodeItem';
import { node } from '../__fixtures__';

describe("NodeItem", function() {
  it('should render NodeItem component', () => {
    const component = shallow(<NodeItem node={node} />);
    expect(component).toMatchSnapshot();
  });
});
