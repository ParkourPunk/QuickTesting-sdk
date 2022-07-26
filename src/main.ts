import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { QueryClient } from '../src/protoquery/cosmos/queryclient';
import { setupBankExtension } from '../src/protoquery/cosmos/bank/queries';
import * as transactions from './protoquery/transactions';
import { BroadcastMode } from './codec/external/cosmos/tx/v1beta1/service';

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
