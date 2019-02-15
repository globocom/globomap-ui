export const node = {
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
};

export const nodes = [
  {
    "_id": "tag_firewall/gproxy_LmdpdGh1Yi1jbG91ZC5zMy5hbWF6b25hd3MuY29t",
    "id": "LmdpdGh1Yi1jbG91ZC5zMy5hbWF6b25hd3MuY29t",
    "name": ".github-cloud.s3.amazonaws.com",
    "provider": "gproxy",
    "timestamp": 1511247666,
    "properties": null,
    "properties_metadata": null,
    "type": "tag_firewall"
  },
  {
    "_id": "tag_firewall/gproxy_LnMzLXNhLWVhc3QtMS5hbWF6b25hd3MuY29t",
    "id": "LnMzLXNhLWVhc3QtMS5hbWF6b25hd3MuY29t",
    "name": ".s3-sa-east-1.amazonaws.com",
    "provider": "gproxy",
    "timestamp": 1511247655,
    "properties": null,
    "properties_metadata": null,
    "type": "tag_firewall"
  }
];

export const collections = [
  {
    "alias": "Host",
    "name": "comp_unit",
    "kind": "document",
    "icon": "comp_unit",
    "description": "Host",
    "users": [
      "u_globomap_driver_acs",
      "u_globomap_driver_cmdb",
      "u_globomap_driver_napi"
    ]
  },
  {
    "alias": "DNS",
    "name": "dns",
    "kind": "document",
    "icon": "dns",
    "description": "DNS",
    "users": [
      "u_globomap_driver_dns"
    ]
  },
  {
    "alias": "VIP",
    "name": "vip",
    "kind": "document",
    "icon": "vip",
    "description": "VIP",
    "users": [
      "u_globomap_driver_napi"
    ]
  }
];

export const edges = [
  {
    "alias": "ACL",
    "name": "access",
    "kind": "edge",
    "icon": "access",
    "description": "ACL",
    "users": [
      "u_globomap_driver_aclapi"
    ]
  },
  {
    "alias": "Link: Pool - Equipamento",
    "name": "tsuru_pool_comp_unit",
    "kind": "edge",
    "icon": "tsuru_pool_comp_unit",
    "description": "Link: Pool - Equipamento",
    "users": [
      "u_globomap_driver_tsuru"
    ]
  },
  {
    "alias": "Link: VLAN - Rede",
    "name": "vlan_network",
    "kind": "edge",
    "icon": "vlan_network",
    "description": "Link: VLAN - Rede",
    "users": [
      "u_globomap_driver_napi"
    ]
  }
];
