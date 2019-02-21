import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { NotFound } from './NotFound';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("NotFound", function() {

  it('should render NotFound component', () => {
    const component = shallow(<NotFound />);
    expect(component).to.exist;
  });

});
