import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { Favorites } from './Favorites';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Favorites", function() {

  let componentWillMountStub;

  beforeEach(function() {
    componentWillMountStub = sinon.stub(Favorites.prototype, 'UNSAFE_componentWillMount').value('newValue');
  });

  afterEach(function () {
    componentWillMountStub.restore();
  });

  it('should render Favorites component', () => {
    const props = {
      userMaps: []
    };
    const component = shallow(<Favorites {...props} />);
    expect(component).to.exist;
  });

});
