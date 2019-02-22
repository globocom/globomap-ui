import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { Properties } from './Properties';
import { node } from '../__fixtures__';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("Properties", function() {
  it('should render Properties component', () => {
    const component = shallow(<Properties item={node} />);
    expect(component).to.exist;
  });
});
