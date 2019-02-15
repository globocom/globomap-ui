import React from 'react';
import { shallow } from 'enzyme';
import { Sidebar } from './Sidebar';

describe("Sidebar", function() {

  it('should render Sidebar component', () => {
    const component = shallow(<Sidebar />);
    expect(component).toMatchSnapshot();
  });

});
