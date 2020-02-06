import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { Favorites } from './Favorites';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Favorites", function() {

  let componentDidMountStub;

  beforeEach(function() {
    window.ga = function() {}
    componentDidMountStub = sinon.stub(Favorites.prototype, 'componentDidMount').value('newValue');
  });

  afterEach(function () {
    componentDidMountStub.restore();
  });

  it('should render Favorites component', () => {
    const props = {
      userMaps: []
    };
    const component = shallow(<Favorites {...props} />);
    expect(component).to.exist;
  });

});
