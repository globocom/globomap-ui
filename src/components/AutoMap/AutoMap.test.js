import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { AutoMap } from './AutoMap';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("AutoMap", function() {

  it('should render AutoMap component', () => {
    const props = { automapNodeList: [] }
    const component = shallow(<AutoMap {...props} />);
    expect(component).to.exist;
  });

});
