import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { SearchHeader } from './SearchHeader';
import { collections } from './helpers/index';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("SearchHeader", function() {
  let wrapper;

  beforeEach(() => {
    const props = { collections }
    wrapper = shallow(<SearchHeader {...props} />);
  });

  it('should render SearchHeader component', () => {
    expect(wrapper).to.exist;
  });

});
