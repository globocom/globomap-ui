import { uuid, traverseItems } from '../../utils';

const STAGE_ADD_NODE = 'stage_add_node';
const STAGE_REMOVE_NODE = 'stage_remove_node';
const STAGE_SET_NODES = 'stage_set_nodes';
const STAGE_CLEAN_NODES = 'stage_clean_nodes';

const initialState = {
  stageNodes: []
}

export default function reducer(state=initialState, action={}) {
  switch (action.type) {

    case STAGE_ADD_NODE:
      const { node, parentUuid } = action;

      if(stageHasNode(state, { node, parentUuid })) {
        return state;
      }

      node.uuid = uuid();
      node.items = node.items || [];
      let currentNodes = state.stageNodes.slice();

      if(parentUuid) {
        traverseItems(currentNodes, (n) => {
          if(n.uuid === parentUuid) {
            n.items.push(node);
          }
        });
      } else {
        node.root = true;
        node.items = [];
        currentNodes = [node];
      }

      return {
        ...state,
        stageNodes: currentNodes
      }

    case STAGE_REMOVE_NODE:
      currentNodes = state.stageNodes.slice();
      const i = currentNodes.findIndex((n) => {
        return n.uuid === node.uuid;
      });

      if (i >= 0) {
        currentNodes.splice(i, 1);
      } else {
        traverseItems(currentNodes, (n) => {
          const j = n.items.findIndex((n) => {
            return n.uuid === node.uuid;
          });
          if (j >= 0) {
            n.items.splice(j, 1);
          }
        });
      }

      // if (currentNodes.length > 0 && currentNodes[0].items !== undefined) {
      //   if (currentNodes[0].items.length === 0) {
      //     this.setCurrentTab('Search Results');
      //   }
      // }

      return {
        ...state,
        stageNodes: currentNodes
      };

    case STAGE_SET_NODES:
      return {
        ...state,
        stageNodes: action.stageNodes
      };

    case STAGE_CLEAN_NODES:
      return {
        ...state,
        stageNodes: []
      }

    default:
      return state;
  }
}

export function addStageNode(node, parentUuid) {
  return {
    type: STAGE_ADD_NODE,
    node,
    parentUuid
  };
}

export function removeStageNode(node) {
  return {
    type: STAGE_REMOVE_NODE,
    node
  }
}

export function setStageNodes(stageNodes) {
  return {
    type: STAGE_SET_NODES,
    stageNodes
  }
}

export function cleanStageNodes() {
  return {
    type: STAGE_CLEAN_NODES
  }
}

// Selectors
export function stageHasNode(state, { node, parentUuid }) {
  const stageNodes = state.stageNodes;
  let ids = stageNodes.map(n => n._id);

  if (parentUuid !== undefined) {
    traverseItems(stageNodes, (n) => {
      if (n.uuid === parentUuid) {
        ids = n.items.map(n => n._id);
      }
    });
  }

  return !(ids.indexOf(node._id) < 0);
}

export function getStageNode(state, { node, parentUuid }) {
  const stageNodes = state.stageNodes;
  let nodeFound = false;

  traverseItems(stageNodes, (n) => {
    if(n.uuid === node.uuid) {
      nodeFound = n;
    }
  });

  if (!nodeFound && parentUuid !== undefined) {
    traverseItems(stageNodes, (n) => {
      if (n.uuid === parentUuid) {
        for (let i in n.items) {
          if (node._id === n.items[i]._id) {
            nodeFound = n.items[i];
          }
        }
      }
    });
  }

  return nodeFound;
}
