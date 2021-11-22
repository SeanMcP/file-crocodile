export default function buildTree(maxDepth = 3, maxChildren = 3) {
  const TREE = {
    name: "root",
    children: [],
  };

  const namesByParentName = {
    root: ["plants", "animals", "states"],
    plants: ["trees", "bushes", "flowers"],
    animals: ["birds", "mammals", "fish"],
    states: ["solid", "liquid", "gas"],
    trees: ["oak", "maple", "apple"],
    bushes: ["blackberries", "roses", "laurels"],
    flowers: ["tulips", "carnations", "violets"],
    birds: ["cardinals", "robins", "crows"],
    mammals: ["elephants", "llamas", "beavers"],
    fish: ["shark", "salmon", "betta"],
    solid: ["rock", "ice", "leaf"],
    liquid: ["water", "lava", "milk"],
    gas: ["oxygen", "vapor", "helium"],
  };

  Object.entries(namesByParentName).forEach(([key, array]) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    namesByParentName[key] = array;
  });

  const childWithSecret = Math.floor(Math.random() * maxChildren);
  let secretHasBeenPlaced = false;

  function addNodes(parent, startingDepth = 1) {
    const depth = startingDepth;
    let siblingDirCount = 0;
    for (let i = 0; i < maxChildren; i++) {
      const node = {
        name: namesByParentName[parent.name][i],
      };
      if (siblingDirCount < maxChildren - 1) {
        if (depth < maxDepth) {
          siblingDirCount++;
          node.children = [];
          addNodes(node, depth + 1);
        }
      }
      if (!secretHasBeenPlaced && depth === maxDepth && i === childWithSecret) {
        node.secret = true;
        secretHasBeenPlaced = true;
      }
      if (Math.random() > 0.5) {
        parent.children.push(node);
      } else {
        parent.children.unshift(node);
      }
    }
  }

  addNodes(TREE);

  return TREE;
}
