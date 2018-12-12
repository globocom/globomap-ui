import React from 'react';
import { shallow } from 'enzyme';
import { Tab } from './Tab';

describe("Tab", function() {

  it('should render Tab component', () => {
    const component = shallow(<Tab><button></button></Tab>);
    expect(component).toMatchSnapshot();
  });

});
