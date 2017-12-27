/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Header from '../Header';


describe("Header", function() {

  test('Render the entire Header', () => {
    const graphs = [],
          collections = [];

    const wrapper = shallow(
      <Header
        graphs={graphs}
        collections={collections} />
    );
    const p = wrapper.find('.logo');
    expect(p.text() === "globo");
  });

});
