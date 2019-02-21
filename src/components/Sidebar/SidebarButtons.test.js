import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { SidebarButtons } from './SidebarButtons';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("SidebarButtons", function() {

  it('should render SidebarButtons component', () => {
    const component = shallow(<SidebarButtons />);
    expect(component).to.exist;
  });

});
