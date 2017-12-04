import React from 'react';
import {unmountComponentAtNode} from "react-dom";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import sinon from "sinon";
import { shallow, mount, render } from 'enzyme';

import App from '../App';


describe("App", function() {

  let componentDidMountStub;

  beforeEach(function() {
    componentDidMountStub = sinon.stub(App.prototype, 'componentDidMount').value('newValue');
  });

  afterEach(function () {
    componentDidMountStub.restore();
    unmountComponentAtNode(document);
    document.body.innerHTML = "";
  });

  test('Render the entire App', () => {
    // const todo = { id: 1, done: false, name: 'Buy Milk' };
    const wrapper = shallow(
      <App />
    );
    const element = wrapper.find('.main-xxxx');
    expect(element.text() === " ");
  });

});
