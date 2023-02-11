const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;

describe("Test circuit", function async() {
    this.timeout(1000 * 1000);

    it("when circiut is compiled", async () => {
        let circuit = await wasm_tester(
            path.join(__dirname, "../circuit/circuit.circom"),
            {
                compile: true,  // default is true
                verbose: true,
            }
            // We have all other options that we have while compiling the circuit using circom CLI, like:
            // sym: false, to skip sym generation
            // wasm: false, to skip wasm generation
            // r1cs: false, to skip r1cs generation
        );

        const witness = await circuit.calculateWitness({x: 3, y: 2});

        await circuit.assertOut(witness, {z: "6"})
    });

    it("when circuit is not compiled", async () => {

        let circuit = await wasm_tester(
            path.join(__dirname, "../circuit/circuit.circom"),
            {
                recompile: false,
                output: path.join(__dirname, "../circuit/"),    // specify path to already compiled circuit and wasm files
                verbose: true
            }
        );

        const witness = await circuit.calculateWitness({x: 3, y: 3});

        await circuit.assertOut(witness, {z: "9"})
    });
});