import React from 'react';
import { shallow } from 'enzyme';
import { Stage } from './Stage';

describe("Stage", function() {

  it('should render Stage component', () => {
    const component = shallow(<Stage />);
    expect(component).toMatchSnapshot();
  });

});
