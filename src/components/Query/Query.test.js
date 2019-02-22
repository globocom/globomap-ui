import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { Query } from './Query';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Query", function() {

  it('should render Query component', () => {
    const component = shallow(<Query />);
    expect(component).to.exist;
  });

});
