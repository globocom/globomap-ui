import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { Reports } from './Reports';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Reports", function() {

  beforeEach(function() {
    window.ga = function() {}
  });

  it('should render Reports component', () => {
    const props = { queries: [], reportNodes: [] }
    const component = shallow(<Reports {...props} />);
    expect(component).to.exist;
  });

});
