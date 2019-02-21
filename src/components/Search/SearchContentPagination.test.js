import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { SearchContentPagination } from './SearchContentPagination';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("SearchContentPagination", function() {

  it('should render SearchContentPagination component', () => {
    const component = shallow(<SearchContentPagination />);
    expect(component).to.exist;
  });

});
