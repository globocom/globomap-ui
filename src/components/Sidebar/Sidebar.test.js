import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { Sidebar } from './Sidebar';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Sidebar", function() {

  it('should render Sidebar component', () => {
    const component = shallow(<Sidebar />);
    expect(component).to.exist;
  });

});
