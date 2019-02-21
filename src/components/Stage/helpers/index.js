export const stageNodes = [
  {
    "_id": "comp_unit/globomap_cmfdnc01",
    "id": "cmfdnc01",
    "name": "cmfdnc01",
    "provider": "globomap",
    "timestamp": 1550558398,
    "properties": {
      "equipment_type": "Servidor",
      "maintenance": false,
      "ips": [
        "10.224.0.50",
        "10.224.0.49",
        "10.224.0.41"
      ]
    },
    "properties_metadata": {
      "equipment_type": {
        "description": "Equipment Type"
      },
      "maintenance": {
        "description": "Maintenance"
      },
      "ips": {
        "description": "IPs"
      }
    },
    "type": "comp_unit",
    "uuid": "b675ac09-9392-4602-9ae0-b4f832d4c5bb",
    "items": [
      {
        "_id": "network/napi_v4_78742",
        "id": "v4_78742",
        "name": "10.224.0.0/24",
        "provider": "napi",
        "timestamp": 1550557793,
        "properties": {
          "active": true,
          "network_type": "Rede invalida equipamentos"
        },
        "properties_metadata": {
          "active": {
            "description": "Active Network"
          },
          "network_type": {
            "description": "Network Type"
          }
        },
        "type": "network",
        "edges": {
          "in": [],
          "out": [
            {
              "_id": "network_comp_unit/napi_v4_1376056",
              "_from": "network/napi_v4_78742",
              "_to": "comp_unit/globomap_cmfdnc01",
              "id": "v4_1376056",
              "name": "",
              "provider": "napi",
              "timestamp": 1550731219,
              "properties": null,
              "properties_metadata": null,
              "type": "network_comp_unit",
              "dir": "out"
            },
            {
              "_id": "network_comp_unit/napi_v4_1435853",
              "_from": "network/napi_v4_78742",
              "_to": "comp_unit/globomap_cmfdnc01",
              "id": "v4_1435853",
              "name": "",
              "provider": "napi",
              "timestamp": 1550731219,
              "properties": null,
              "properties_metadata": null,
              "type": "network_comp_unit",
              "dir": "out"
            },
            {
              "_id": "network_comp_unit/napi_v4_1376057",
              "_from": "network/napi_v4_78742",
              "_to": "comp_unit/globomap_cmfdnc01",
              "id": "v4_1376057",
              "name": "",
              "provider": "napi",
              "timestamp": 1550731219,
              "properties": null,
              "properties_metadata": null,
              "type": "network_comp_unit",
              "dir": "out"
            }
          ],
          "graph": "networking_topology"
        },
        "uuid": "d2337903-032d-4338-aa86-a1e8747c60af",
        "items": []
      }
    ],
    "root": true
  }
]

export const subNodesByGraph = [
  {
    "graph": "acl",
    "edges": [
      {
        "_id": "access/aclapi_356578",
        "_from": "network/napi_v4_273022",
        "_to": "comp_unit/globomap_cmfdnc01",
        "id": "356578",
        "name": "10.225.126.0/24-10.224.0.49/32",
        "provider": "aclapi",
        "timestamp": 1550748885,
        "properties": {
          "action": "permit",
          "description": "cloud.cmfdnc01.globoi.com ",
          "destination": "10.224.0.49/32",
          "owner": "dstelman",
          "protocol": "ip",
          "sequence": 8,
          "source": "10.225.126.0/24",
          "kind": "vlan"
        },
        "properties_metadata": {
          "action": {
            "description": "Access action"
          },
          "description": {
            "description": "Access description"
          },
          "destination": {
            "description": "Destination address"
          },
          "owner": {
            "description": "User creater of access"
          },
          "protocol": {
            "description": "Protocol of access"
          },
          "sequence": {
            "description": "Sequence"
          },
          "source": {
            "description": "Source address"
          },
          "kind": {
            "description": "Kind of ACL"
          }
        },
        "type": "access",
        "dir": "out"
      }
    ],
    "nodes": [
      {
        "_id": "comp_unit/globomap_cmfdnc01",
        "id": "cmfdnc01",
        "name": "cmfdnc01",
        "provider": "globomap",
        "timestamp": 1550558398,
        "properties": {
          "equipment_type": "Servidor",
          "maintenance": false,
          "ips": [
            "10.224.0.50",
            "10.224.0.49",
            "10.224.0.41"
          ]
        },
        "properties_metadata": {
          "equipment_type": {
            "description": "Equipment Type"
          },
          "maintenance": {
            "description": "Maintenance"
          },
          "ips": {
            "description": "IPs"
          }
        },
        "type": "comp_unit"
      }
    ],
    "subnodes": [
      {
        "_id": "network/napi_v4_273022",
        "id": "v4_273022",
        "name": "10.225.126.0/24",
        "provider": "napi",
        "timestamp": 1550557714,
        "properties": {
          "active": true,
          "network_type": "Rede invalida equipamentos"
        },
        "properties_metadata": {
          "active": {
            "description": "Active Network"
          },
          "network_type": {
            "description": "Network Type"
          }
        },
        "type": "network",
        "edges": {
          "in": [],
          "out": [
            {
              "_id": "access/aclapi_356578",
              "_from": "network/napi_v4_273022",
              "_to": "comp_unit/globomap_cmfdnc01",
              "id": "356578",
              "name": "10.225.126.0/24-10.224.0.49/32",
              "provider": "aclapi",
              "timestamp": 1550748885,
              "properties": {
                "action": "permit",
                "description": "cloud.cmfdnc01.globoi.com ",
                "destination": "10.224.0.49/32",
                "owner": "dstelman",
                "protocol": "ip",
                "sequence": 8,
                "source": "10.225.126.0/24",
                "kind": "vlan"
              },
              "properties_metadata": {
                "action": {
                  "description": "Access action"
                },
                "description": {
                  "description": "Access description"
                },
                "destination": {
                  "description": "Destination address"
                },
                "owner": {
                  "description": "User creater of access"
                },
                "protocol": {
                  "description": "Protocol of access"
                },
                "sequence": {
                  "description": "Sequence"
                },
                "source": {
                  "description": "Source address"
                },
                "kind": {
                  "description": "Kind of ACL"
                }
              },
              "type": "access",
              "dir": "out"
            },
            {
              "_id": "access/aclapi_356582",
              "_from": "network/napi_v4_273022",
              "_to": "comp_unit/globomap_cmfdnc01",
              "id": "356582",
              "name": "10.225.126.0/24-10.224.0.50/32",
              "provider": "aclapi",
              "timestamp": 1550748886,
              "properties": {
                "action": "permit",
                "destination": "10.224.0.50/32",
                "owner": "dstelman",
                "protocol": "ip",
                "sequence": 9,
                "source": "10.225.126.0/24",
                "kind": "vlan"
              },
              "properties_metadata": {
                "action": {
                  "description": "Access action"
                },
                "destination": {
                  "description": "Destination address"
                },
                "owner": {
                  "description": "User creater of access"
                },
                "protocol": {
                  "description": "Protocol of access"
                },
                "sequence": {
                  "description": "Sequence"
                },
                "source": {
                  "description": "Source address"
                },
                "kind": {
                  "description": "Kind of ACL"
                }
              },
              "type": "access",
              "dir": "out"
            },
            {
              "_id": "access/aclapi_356585",
              "_from": "network/napi_v4_273022",
              "_to": "comp_unit/globomap_cmfdnc01",
              "id": "356585",
              "name": "10.225.126.0/24-10.224.0.50/32",
              "provider": "aclapi",
              "timestamp": 1550748886,
              "properties": {
                "action": "permit",
                "destination": "10.224.0.50/32",
                "owner": "dstelman",
                "protocol": "ip",
                "sequence": 10,
                "source": "10.225.126.0/24",
                "kind": "vlan"
              },
              "properties_metadata": {
                "action": {
                  "description": "Access action"
                },
                "destination": {
                  "description": "Destination address"
                },
                "owner": {
                  "description": "User creater of access"
                },
                "protocol": {
                  "description": "Protocol of access"
                },
                "sequence": {
                  "description": "Sequence"
                },
                "source": {
                  "description": "Source address"
                },
                "kind": {
                  "description": "Kind of ACL"
                }
              },
              "type": "access",
              "dir": "out"
            }
          ],
          "graph": "acl"
        }
      }
    ]
  }
]

export const items = {
  "graph": "custeio",
  "edges": [],
  "nodes": [],
  "subnodes": []
}

export const graphs = [
  {
    "name": "acl",
    "alias": "ACL",
    "icon": "acl",
    "description": null,
    "links": [
      {
        "edge": "access",
        "from_collections": [
          "environment",
          "comp_unit",
          "network"
        ],
        "to_collections": [
          "comp_unit",
          "network",
          "vip"
        ]
      }
    ],
    "colorClass": "graph-color-0",
    "enabled": false
  }
]
