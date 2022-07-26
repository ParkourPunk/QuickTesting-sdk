const client = require("./ixo-client-sdk-typescript/build/esm/index");

async function test() {
    const wal = await client.makeWallet(
        "creek obvious bamboo ozone dwarf above hill muscle image fossil drastic toy"
    );
    console.log(wal)
}
test();
