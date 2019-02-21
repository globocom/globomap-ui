import React from 'react';
import sinon from 'sinon';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { TabContent } from './TabContent';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("TabContent", function() {

  let componentDidMountStub;

  beforeEach(function() {
    componentDidMountStub = sinon.stub(TabContent.prototype, 'componentDidMount').value('newValue');
  });

  afterEach(function () {
    componentDidMountStub.restore();
  });

  it('should render TabContent component', () => {
    const component = shallow(<TabContent><div></div></TabContent>);
    expect(component).to.exist;
  });

});
