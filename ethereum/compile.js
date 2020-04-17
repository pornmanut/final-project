const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const contractNameList = ["Base.sol", "Survey.sol"];
const exportPath = path.resolve(__dirname, "build");
const _sources = {};
contractNameList.forEach(contractName => {
  _sources[contractName] = {
    content: fs.readFileSync(
      path.resolve(__dirname, "contracts", contractName),
      "utf8"
    )
  };
});
const input = {
  language: "Solidity",
  sources: _sources,
  settings: {
    optimizer: {
      enabled: true,
      runs: 300
    },
    outputSelection: {
      "*": {
        "": ["ast"],
        "*": [
          "abi",
          "evm.bytecode.object",
          "evm.bytecode.sourceMap",
          "evm.deployedBytecode.object",
          "evm.deployedBytecode.sourceMap"
        ]
      }
    }
  }
};

try {
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  let exportName;
  contractNameList.forEach(contractName => {
    for (let contract in output.contracts[contractName]) {
      exportName = contract + ".json";
      fs.outputJSONSync(
        path.resolve(exportPath, exportName),
        output.contracts[contractName][contract]
      );
      console.log(`Create build file from ${contractName} to ${exportName}`);
    }
  });
} catch (error) {
  console.log(error);
}
