import React from 'react';
import { shallow } from 'enzyme';
import { Loading } from './Loading';

describe("Loading", function() {

  it('should render Loading component', () => {
    const component = shallow(<Loading />);
    expect(component).toMatchSnapshot();
  });

});
