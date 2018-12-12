import React from 'react';
import { shallow } from 'enzyme';
import { Properties } from './Properties';
import { node } from '../__fixtures__';

describe("Properties", function() {
  it('should render Properties component', () => {
    const component = shallow(<Properties item={node} />);
    expect(component).toMatchSnapshot();
  });
});
