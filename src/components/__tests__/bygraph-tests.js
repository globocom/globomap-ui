import React from 'react';
import ReactDOM from 'react-dom';
import {unmountComponentAtNode} from "react-dom";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import sinon from "sinon";
import { shallow, mount, render } from 'enzyme';

import ByGraph from '../ByGraph';


describe("ByGraph", function() {

  test('Render the ByGraph box', () => {
    const items = {
            "graph": "acl",
            "edges": [],
            "nodes": [
              {
                "_id": "tag_firewall/gproxy_LnMzLXNhLWVhc3QtMS5hbWF6b25hd3MuY29t",
                "id": "LnMzLXNhLWVhc3QtMS5hbWF6b25hd3MuY29t",
                "name": ".s3-sa-east-1.amazonaws.com",
                "provider": "gproxy",
                "timestamp": 1512025259,
                "properties": null,
                "properties_metadata": null,
                "type": "tag_firewall"
              }
            ],
            "subnodes": []
          },
          graphs = [
            {
              "name": "acl",
              "colorClass": "graph-color0",
              "enabled": false
            },
            {
              "name": "cloud_stack",
              "colorClass": "graph-color1",
              "enabled": false
            },
            {
              "name": "custeio",
              "colorClass": "graph-color2",
              "enabled": false
            },
            {
              "name": "dns",
              "colorClass": "graph-color3",
              "enabled": false
            },
            {
              "name": "galeb",
              "colorClass": "graph-color4",
              "enabled": false
            },
            {
              "name": "load_balancing",
              "colorClass": "graph-color5",
              "enabled": false
            },
            {
              "name": "networking_topology",
              "colorClass": "graph-color6",
              "enabled": false
            },
            {
              "name": "permission",
              "colorClass": "graph-color7",
              "enabled": false
            },
            {
              "name": "tsuru",
              "colorClass": "graph-color8",
              "enabled": false
            },
            {
              "name": "zabbix",
              "colorClass": "graph-color9",
              "enabled": false
            }
          ]

    const wrapper = shallow(
      <ByGraph
        items={items}
        graphs={graphs} />
    );
    const element = wrapper.find('.sub-nodes-by-graph');
    expect(element.length).toEqual(0);
  });

});
