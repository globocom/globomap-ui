import React from 'react';
import { shallow } from 'enzyme';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { Stage } from './Stage';
import { stageNodes } from './helpers/index';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Stage", function() {
  let wrapper;

  beforeEach(() => {
    const props = { stageNodes }
    wrapper = shallow(<Stage {...props} />);
  });

  it('should render Stage component', () => {
    expect(wrapper).to.exist;
    expect(wrapper.find(".stage")).to.exist;
  });

});
