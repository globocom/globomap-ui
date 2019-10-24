import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { App } from './App';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe("App", () => {
  let component = null;
  let componentDidMountStub;

  beforeAll(() => {
    const props = {
      match: { params: { mapKey: null } },
      fetchGraphs: () => {},
      fetchCollections: () => {},
      fetchEdges: () => {},
      fetchQueries: () => {},
      getServerData: () => {},
      getPlugins: () => {}
    };
    component = shallow(<App {...props} />);
  });

  beforeEach(() => {
    componentDidMountStub = sinon.stub(App.prototype, 'componentDidMount').value('newValue');
  });

  afterEach(() => {
    componentDidMountStub.restore();
  });

  it('should render the App component', () => {
    expect(component).to.exist;
  });

});
