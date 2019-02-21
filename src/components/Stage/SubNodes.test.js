import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { SubNodes } from './SubNodes';
import { subNodesByGraph } from './helpers/index';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("SubNodes", function() {
  let wrapper;

  beforeEach(() => {
    const props = { subNodesByGraph }
    wrapper = shallow(<SubNodes {...props} />);
  });

  it('should render SubNodes component', () => {
    expect(wrapper).to.exist;
  });

});
