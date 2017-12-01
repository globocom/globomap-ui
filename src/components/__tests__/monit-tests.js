import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Monit from '../Monit';

describe("Monit", function() {

  test('Render the entire Monit', () => {
    const node = {
      "_id": "comp_unit/globomap_5d9ed63b-1985-4d3a-98d4-8b0195ce1c53",
      "id": "5d9ed63b-1985-4d3a-98d4-8b0195ce1c53",
      "name": "cartolaapi-02-145989229527",
      "provider": "globomap",
      "timestamp": 1511441091,
      "properties": {
        "equipment_type": "Servidor Virtual",
        "host": "cmal18mp11lc03",
        "ips": [
          "10.132.67.64"
        ],
        "uuid": "5d9ed63b-1985-4d3a-98d4-8b0195ce1c53"
      },
      "properties_metadata": {
        "equipment_type": {
          "description": "Equipment Type"
        },
        "host": {
          "description": "Host name"
        },
        "ips": {
          "description": "IPs"
        },
        "uuid": {
          "description": "UUID"
        }
      },
      "type": "comp_unit",
      "edges": {
        "in": [
          {
            "_id": "access/aclapi_251406",
            "_from": "network/napi_v4_36200",
            "_to": "comp_unit/globomap_5d9ed63b-1985-4d3a-98d4-8b0195ce1c53",
            "id": "251406",
            "name": "10.130.7.224/27-10.132.67.64/32",
            "provider": "aclapi",
            "timestamp": 1512019453,
            "properties": {
              "protocol": "tcp",
              "destination": "10.132.67.64/32",
              "source": "10.130.7.224/27",
              "action": "permit"
            },
            "properties_metadata": {
              "protocol": {
                "description": "Protocol of access"
              },
              "destination": {
                "description": "Destination address"
              },
              "source": {
                "description": "Source address"
              },
              "action": {
                "description": "Access action"
              }
            },
            "type": "access",
            "dir": "in"
          }
        ],
        "out": [],
        "graph": "acl"
      },
      "uuid": "2dc992f7-f9fd-432a-a9d6-b0484d4861b3",
      "items": [],
      "exist": true
    }

    const wrapper = shallow(
      <Monit
        node={node} />
    );
    const element = wrapper.find('.monit');
    expect(element.length).toBe(1);
  });

});
