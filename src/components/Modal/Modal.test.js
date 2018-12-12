import React from 'react';
import { shallow } from 'enzyme';
import { Modal } from './Modal';

describe("Modal", function() {

  it('should render Modal component', () => {
    const component = shallow(<Modal />);
    expect(component).toMatchSnapshot();
  });

});
