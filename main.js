(function () {
  const directoryEl = document.getElementById("directory");
  const messageEl = document.getElementById("message");
  const parentLink = document.getElementById("parent");
  const terminalForm = document.getElementById("terminal");
  const titleEl = document.getElementById("title");

  const TREE = {
    name: "root",
    children: [
      {
        name: "Red",
        children: [
          {
            name: "Pepper",
          },
          {
            name: "Tomato",
            children: [
              {
                name: "Dog",
              },
              {
                name: "Cat",
              },
            ],
          },
        ],
      },
      {
        name: "Orange",
        children: [
          {
            name: "Carrot",
          },
          {
            name: "Pumpkin",
          },
        ],
      },
      {
        name: "Yellow",
        children: [
          {
            name: "Corn",
          },
          {
            name: "Squash",
            children: [
              {
                name: "Dolphin",
              },
              {
                name: "Owl",
              },
            ],
          },
        ],
      },
    ],
  };

  function searchTree(node, name) {
    if (!name || name === "root") return [TREE, null];
    let parent = TREE;
    let found = null;

    function recursiveSearch(_node, _name) {
      if (_node.name == _name) {
        return (found = _node);
      } else if (_node.children) {
        for (let i = 0; !found && i < _node.children.length; i++) {
          parent = _node;
          recursiveSearch(_node.children[i], name);
        }
      }
    }

    recursiveSearch(node, name);

    return found
      ? [found, parent.name === found.name ? null : parent]
      : [null, null];
  }

  function render() {
    const [tree, parent] = searchTree(TREE, location.hash.slice(1));
    titleEl.textContent = tree.name === "root" ? "File Crocodile" : tree.name;
    directoryEl.textContent = "";
    if (parent) {
      parentLink.textContent = "⬅️";
      parentLink.href = parent.name === "root" ? "/" : "#" + parent.name;
    }
    tree.children.forEach((node) => {
      let item;
      if (node.children) {
        item = document.createElement("a");
        item.href = "#" + node.name;
      } else {
        item = document.createElement("button");
      }
      item.classList.add("item");
      item.textContent = node.name;
      directoryEl.appendChild(item);
    });
  }

  render();

  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    messageEl.textContent = "";
    const fd = new FormData(event.target);
    const cli = fd.get("cli");
    const [command, option] = cli.split(" ");
    if (command === "cd") {
      if (option === "..") {
        const [, parent] = searchTree(TREE, window.location.hash.slice(1));
        if (parent) {
          if (parent.name === "root") return (window.location = "/");
          window.location.hash = "#" + parent.name;
          render();
        } else {
          window.location = window.location;
        }
      } else {
        const [tree] = searchTree(TREE, option);
        if (tree) {
          window.location.hash = "#" + tree.name;
          render();
        } else {
          messageEl.textContent = `ls: ${option}: No such file or directory`;
        }
      }
    } else if (command === "clear") {
      messageEl.textContent = "";
    } else if (command === "help") {
      messageEl.textContent = [
        "Available commands:",
        "cd     navigate to directory",
        "clear  clear the terminal screen",
        "help   list available commands",
        "ls     list directory contents",
        "pwd    return working directory name",
      ].join("\n    ");
    } else if (command === "ls") {
      const [tree, parent] = searchTree(
        TREE,
        option ? option : window.location.hash.slice(1)
      );
      if (tree) {
        messageEl.textContent = `${parent ? "..\n" : ""}${
          tree.children
            ? tree.children.map(({ name }) => name).join("\n")
            : tree.name
        }`;
      } else {
      }
    } else if (command === "pwd") {
      messageEl.textContent = window.location.hash
        ? window.location.hash.slice(1)
        : "/";
    } else {
      messageEl.textContent = `command not found: ${command}`;
    }
    event.target.reset();
  });

  window.addEventListener("hashchange", (event) => {
    event.preventDefault();
    messageEl.textContent = "";
    render();
  });
})();
