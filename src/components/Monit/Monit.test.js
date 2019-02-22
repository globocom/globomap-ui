import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { Monit } from './Monit';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Monit", function() {

  let componentDidMountStub;

  beforeEach(function() {
    componentDidMountStub = sinon.stub(Monit.prototype, 'componentDidMount').value('newValue');
  });

  afterEach(function () {
    componentDidMountStub.restore();
  });

  it('should render Monit component', () => {
    const component = shallow(<Monit />);
    expect(component).to.exist;
  });

});
