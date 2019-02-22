import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { User } from './User';
import { serverData } from './helpers/index';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("User", function() {
  let wrapper;

  beforeEach(() => {
    const props = { serverData }
    wrapper = shallow(<User {...props} />);
  });

  it('should render User component', () => {
    expect(wrapper).to.exist;
  });

});
