import React from 'react';
import { shallow } from 'enzyme';
import { SidebarButtons } from './SidebarButtons';

describe("SidebarButtons", function() {

  it('should render SidebarButtons component', () => {
    const component = shallow(<SidebarButtons />);
    expect(component).toMatchSnapshot();
  });

});
