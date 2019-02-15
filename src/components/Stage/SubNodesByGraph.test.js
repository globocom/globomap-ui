import React from 'react';
import { shallow } from 'enzyme';
import { SubNodesByGraph } from './SubNodesByGraph';
// import { nodes } from '../__fixtures__';

describe("SubNodesByGraph", function() {

  it('should render SubNodesByGraph component', () => {
    const component = shallow(<SubNodesByGraph />);
    expect(component).toMatchSnapshot();
  });

});
