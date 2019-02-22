import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { SubNodesByGraph } from './SubNodesByGraph';
import { items, graphs } from './helpers/index';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("SubNodesByGraph", function() {
  let wrapper;

  beforeEach(() => {
    const props = { items, graphs }
    wrapper = shallow(<SubNodesByGraph {...props} />);
  });

  it('should render SubNodesByGraph component', () => {
    expect(wrapper).to.exist;
  });

});
