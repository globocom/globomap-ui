import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { Loading } from './Loading';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Loading", function() {

  it('should render Loading component', () => {
    const component = shallow(<Loading />);
    expect(component).to.exist;
  });

});
