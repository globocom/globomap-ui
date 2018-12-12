import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Favorites } from './Favorites';

describe("Favorites", function() {

  let componentWillMountStub;

  beforeEach(function() {
    componentWillMountStub = sinon.stub(Favorites.prototype, 'componentWillMount').value('newValue');
  });

  afterEach(function () {
    componentWillMountStub.restore();
  });

  it('should render Favorites component', () => {
    const props = {
      userMaps: []
    };
    const component = shallow(<Favorites {...props} />);
    expect(component).toMatchSnapshot();
  });

});
