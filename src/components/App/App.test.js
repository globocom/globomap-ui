import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { App } from './App';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("App", function() {

  let componentDidMountStub;

  beforeEach(function() {
    componentDidMountStub = sinon.stub(App.prototype, 'componentDidMount').value('newValue');
  });

  afterEach(function () {
    componentDidMountStub.restore();
  });

  it('should render the App component', () => {
    const component = shallow(<App />);
    expect(component).to.exist;
  });

});
