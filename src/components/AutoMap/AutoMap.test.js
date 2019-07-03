import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { AutoMap } from './AutoMap';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("AutoMap", () => {
  let component = null;

  beforeAll(() => {
    const props = { automapNodeList: [] }
    component = shallow(<AutoMap {...props} />);
  })

  it('should render AutoMap component', () => {
    expect(component).to.exist;
  });

  it('should render at least 1 initial kind button', () => {
    expect(component.find('.automap-kind .gmap-btn')).to.not.be.empty;
  });

  it('search input is disabled at initial render', () => {
    expect(component.find('.automap-search .automap-q')).to.have.attr('disabled', 'disabled');
  })

});
