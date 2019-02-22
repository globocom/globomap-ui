import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { NodeEdges } from './NodeEdges';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("NodeEdges", function() {

  it('should render NodeEdges component', () => {
    const component = shallow(<NodeEdges />);
    expect(component).to.exist;
  });

});
