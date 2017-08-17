function traverseItems(nList, fn) {
  for (let i in nList) {
    let node = nList[i];

    fn.apply(this, [node]);

    if (node.items !== undefined && node.items.length > 0) {
      traverseItems(node.items, fn);
    }
  }
}

function getAllIds(nList) {
  let ids = nList.map(n => n._id);
  traverseItems(nList, (n) => {
    if(n.items !== undefined) {
      ids = ids.concat(n.items.map(n => n._id));
    }
  });
  return ids;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

function uuid() {
  return uuidv4();
}

module.exports = {
  traverseItems,
  getAllIds,
  uuid
};
