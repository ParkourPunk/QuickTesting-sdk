import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { QueryClient } from '../src/protoquery/cosmos/queryclient';
import { setupBankExtension } from '../src/protoquery/cosmos/bank/queries';
import * as transactions from './protoquery/transactions';
import * as Projects from './protoquery/projects';
import * as Bonds from './protoquery/bonds';
import { BroadcastMode } from './codec/external/cosmos/tx/v1beta1/service';
import { JsonToArray, Uint8ArrayToJS } from '../src/protoquery/utils';
import { Tx } from './codec/external/cosmos/tx/v1beta1/tx';
import cosmosclient from '@cosmos-client/core';
import { MsgCreateProject } from './codec/project/tx';
import {
  isTsProtoGeneratedType,
  isTxBodyEncodeObject,
  Registry,
} from '@cosmjs/proto-signing';
import {
  defaultRegistryTypes as defaultStargateTypes,
  SigningStargateClient,
} from '@cosmjs/stargate';
async function CosmosProtoTest() {
  async function makeClient(
    rpcUrl: string,
  ): Promise<[QueryClient, Tendermint34Client]> {
    const tmClient = await Tendermint34Client.connect(rpcUrl);

    return [QueryClient.withExtensions(tmClient), tmClient];
  }

  const temClient = await makeClient('https://testnet.ixo.earth/rpc/');
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
interface messageData {
  tx: {
    msg: [
      {
        type: string;
        value: {
          data: any;
          txHash: string;
          senderDid: string;
          projectDid: string;
          pubKey: string;
        };
      },
    ];
  };
}
const message = {
  data:
    '{"tx":{"msg":[{"type":"project/CreateProject","value":{"data":{"@type":"Project","name":"pol test","description":"A 12-month pilot of an innovative decentralised results-based financing mechanism to scale access to educational technologies for remote learning, to achieve primary education outcomes and build a tokenised education economy.","image":"https://pds_pandora.ixo.world/public/6rej1furasxkpzyqvf6","brand":"Chimple Learning","logo":"https://cellnode-pandora.ixo.world/public/rla7bjq579rktl44ur4","location":"IN","sdgs":["4"],"@context":"https://schema.ixo.foundation/entity:2383r9riuew","entitySchemaVersion":"1.0.0","relayerNode":"did:sov:Rmb6Rd1CU6k74FM2xzy6Do","startDate":"2021-09-15T02:00:00.000Z","endDate":"2022-09-30T02:00:00.000Z","status":"Created","stage":"Delivery","version":{"versionNumber":"1","effectiveDate":"2021-06-16T11:30:00.000Z"},"creator":{"id":"did:ixo:chimple","displayName":"Chimple Learning","logo":"https://cellnode-pandora.ixo.world/public/2cxhgpqb3bcktkjzbio","location":"IN","email":"help@chimple.org","website":"https://chimple.org","mission":"Comprehensive early learning technology solutions designed for all children."},"owner":{"id":"did:ixo:chimple","displayName":"Chimple Learning","logo":"https://cellnode-pandora.ixo.world/public/2cxhgpqb3bcktkjzbio","location":"IN","email":"help@chimple.org","website":"https://chimple.org","mission":"Comprehensive early learning technology solutions designed for all children."},"ddoTags":[{"category":"Project Type","tags":["Education & Awareness"]},{"category":"SDG","tags":["SDG4 – Quality Education"]},{"category":"Stage","tags":["Planning"]},{"category":"Sector","tags":["UBS Zone"]}],"displayCredentials":{"@context":"https://www.w3.org/2018/credentials/v1","items":[]},"headlineMetric":{"claimTemplateId":"did:ixo:EHKrVDLXX8zzgR9eKgAtKg"},"embeddedAnalytics":[{"title":"Live Activity Feed","urls":["https://protect2.fireeye.com/v1/url?k=e1684eb8-bef3766f-e16867c6-000babff4033-caf77e8efbded967&q=1&e=c1f985d7-0c7c-4505-915a-8fbe914dbdaa&u=https%3A%2F%2Fdatastudio.google.com%2Fs%2FpMGwQoBhtrg"]}],"page":{"cid":"g6skhn0kv14l66krzbb","version":"1.0.0"},"entityClaims":{"@context":"https://schema.ixo.world/claims:3r08webu2eou","items":[{"@id":"did:ixo:EHKrVDLXX8zzgR9eKgAtKg","visibility":"Public","title":"Learning Performance","description":"The level of performance a student has achieved at a specific period of the learning program.","targetMin":4000,"targetMax":5000,"startDate":"2021-09-15T02:00:00.000Z","endDate":"2022-09-30T02:00:00.000Z","goal":"Learning Progress Claims","agents":[],"claimEvaluation":[],"claimApproval":[],"claimEnrichment":[]},{"@id":"did:ixo:VUgXN2EfwuEbZKHewMTtny","visibility":"Public","title":"Accountable Use of Funds","description":"A generic form to submit claims of project expenditure items, together with supporting evidence.","targetMin":4000,"targetMax":100,"startDate":"2021-09-15T02:00:00.000Z","endDate":"2022-09-30T02:00:00.000Z","goal":"Expenditure Reported","agents":[],"claimEvaluation":[],"claimApproval":[],"claimEnrichment":[]},{"@id":"did:ixo:EENZQ9tUfkmCMD52Qpt9cs","visibility":"Public","title":"Bank Transactions","description":"A general claim for submitting proof of a bank transaction. Requests upload of a document as evidence for the transaction.","targetMin":1,"targetMax":20,"startDate":"2021-09-15T02:00:00.000Z","endDate":"2022-09-30T02:00:00.000Z","goal":"Accountable Bank Transactions","agents":[],"claimEvaluation":[],"claimApproval":[],"claimEnrichment":[]}]},"linkedEntities":[{"@type":"Investment","id":"did:ixo:PTZRqu8BsxNsdFbMyCxtLQ"}],"fees":{"@context":"https://schema.ixo.world/fees/ipfs3r08webu2eou","items":[]},"nodes":{"@context":"https://schema.ixo.world/nodes/ipfs3r08webu2eou","items":[{"@type":"CellNode","id":"#cellnode","serviceEndpoint":"https://cellnode-pandora.ixo.earth"}]},"liquidity":{"@context":"https://schema.ixo.world/liquidity/ipfs3r08webu2eou","items":[]},"service":[],"linkedResources":[],"createdOn":"2022-07-29T14:44:01Z","createdBy":"did:sov:GV1B2NuW5MvczufYCtCTfk","nodeDid":""},"txHash":"5f80d1012cf309dfff22611bb6c13a579be0f7719e39cf62334a6fb38d2f5275","senderDid":"did:sov:GV1B2NuW5MvczufYCtCTfk","projectDid":"did:ixo:CW3JR99iEVf2KBVNEuLCWv","pubKey":"7GZSSbz2YRutvaaa48QyXffezw3bNS2Y3jLwXdnPK6jd"}}],"fee":{"amount":[{"denom":"uixo","amount":"1000000"}],"gas":"0"},"signatures":[{"signature":"6HK3Pce8gOXgPToCQLWZst7uzXII3TPKARtpWDTmaWiPuAQNH7ZdG1T+0ExVIjkxkZnvr86KiSBT1UslzIoVCA==","pub_key":{"type":"tendermint/PubKeyEd25519","value":"XSKDHrj0QmU/+SWRuvtj63ZNbA4i6nchRnzWr6IMFqw="}}]},"mode":"block"}',
};

const test = async () => {
  const parsed: messageData = JSON.parse(message.data);

  // console.log('[PROJECT CREATE]', {
  //   tx: parsed.tx.msg[0].value.txHash,
  //   senddid: parsed.tx.msg[0].value.senderDid,
  //   proj: parsed.tx.msg[0].value.projectDid,
  //   pub: parsed.tx.msg[0].value.pubKey,
  //   data: JsonToArray(JSON.stringify(parsed.tx.msg[0].value.data)),
  // });

  // const rsp = await Projects.QueryProjectDoc('did:ixo:Xcum22jXBqZdmfDehi1giB');
  // console.log(rsp);
  console.log('Starting Create Project Transaction');
  const rsp = await Projects.TransactionCreateProject(
    parsed.tx.msg[0].value.txHash,
    parsed.tx.msg[0].value.senderDid,
    parsed.tx.msg[0].value.projectDid,
    parsed.tx.msg[0].value.pubKey,
    JsonToArray(JSON.stringify(parsed.tx.msg[0].value.data)),
  );
  console.log(rsp);

  //-------------------------------------------------------
};

test();
