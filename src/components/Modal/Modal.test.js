import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { Modal } from './Modal';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Modal", function() {

  it('should render Modal component', () => {
    const component = shallow(<Modal />);
    expect(component).to.exist;
  });

});
