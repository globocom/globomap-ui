import React from 'react';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow } from 'enzyme';
import { NodeItem } from './NodeItem';
import { node } from '../__fixtures__';

chai.use(chaiEnzyme());
const expect = chai.expect;

const IntersectionObserver = function() {};

describe("NodeItem", function() {
  it('should render NodeItem component', () => {
    const component = shallow(<NodeItem node={node} />);
    expect(component).to.exist;
  });
});
