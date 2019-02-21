import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { NodeInfo } from './NodeInfo';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("NodeInfo", function() {
  it('should render NodeInfo component', () => {
    const component = shallow(<NodeInfo />);
    expect(component).to.exist;
  });
});
