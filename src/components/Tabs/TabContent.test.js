import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { TabContent } from './TabContent';

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
    expect(component).toMatchSnapshot();
  });

});
