
function traverseItems(nList, fn, level=0) {
  for (let i in nList) {
    let node = nList[i];

    fn.apply(this, [node, level]);

    if (node.items !== undefined && node.items.length > 0) {
      traverseItems(node.items, fn, level + 1);
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
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function uuid() {
  return uuidv4();
}


module.exports = {
  traverseItems,
  getAllIds,
  uuid
};




