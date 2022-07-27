import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { QueryClient } from '../src/protoquery/cosmos/queryclient';
import { setupBankExtension } from '../src/protoquery/cosmos/bank/queries';
import * as transactions from './protoquery/transactions';
import * as Projects from './protoquery/projects';
import { BroadcastMode } from './codec/external/cosmos/tx/v1beta1/service';
import { JsonToArray, Uint8ArrayToJS } from '../src/protoquery/utils';
async function CosmosProtoTest() {
  async function makeClient(
    rpcUrl: string,
  ): Promise<[QueryClient, Tendermint34Client]> {
    const tmClient = await Tendermint34Client.connect(rpcUrl);

    return [QueryClient.withExtensions(tmClient), tmClient];
  }

  const temClient = await makeClient('https://testnet.ixo.world/rpc/');
  const qc = new QueryClient(temClient[1]);

  const bankEx = setupBankExtension(qc);

  const bankResult = await bankEx.bank.balance(
    'ixo1ky7wad4d7gjtcy5yklc83geev76cudcevmnhhn',
    'ixo',
  );
}

async function IXoProtoTest() {
  const Uint8ArrayData = new Uint8Array();
  const transactionResult = await transactions.ServiceBroadcastTx(
    Uint8ArrayData,
    BroadcastMode.BROADCAST_MODE_UNSPECIFIED,
  );
}

async function IXoProjectTest() {
  const ProjectResult = await Projects.QueryProjectDoc('Project DID here');
  // Converting the recived Unit8Array to a readable object
  const cleanData = Uint8ArrayToJS(ProjectResult.projectDoc.data);
  // Converting readable object to a Unit8Array
  const myUint8Array = JsonToArray(cleanData);
}
IXoProjectTest();
