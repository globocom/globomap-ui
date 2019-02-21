import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { SearchContent } from './SearchContent';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("SearchContent", function() {

  it('should render SearchContent component', () => {
    const component = shallow(<SearchContent />);
    expect(component).to.exist;
  });

});
