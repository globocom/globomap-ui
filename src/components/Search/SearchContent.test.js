import React from 'react';
import { shallow } from 'enzyme';
import { SearchContent } from './SearchContent';

describe("SearchContent", function() {

  it('should render SearchContent component', () => {
    const component = shallow(<SearchContent />);
    expect(component).toMatchSnapshot();
  });

});
