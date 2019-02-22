import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { Tab } from './Tab';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Tab", function() {

  it('should render Tab component', () => {
    const component = shallow(<Tab><button></button></Tab>);
    expect(component).to.exist;
  });

});
