import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { Search } from './Search';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Search", function() {

  beforeEach(function() {
    window.ga = function() {}
  });

  it('should render Search component', () => {
    const component = shallow(<Search />);
    expect(component).to.exist;
  });

});
