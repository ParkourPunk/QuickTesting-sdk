import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { QueryClient } from '../src/protoquery/cosmos/queryclient';
import { setupBankExtension } from '../src/protoquery/cosmos/bank/queries';
import * as transactions from './protoquery/transactions';
import * as Projects from './protoquery/projects';
import { BroadcastMode } from './codec/external/cosmos/tx/v1beta1/service';
import {
  getPublicKey,
  JsonToArray,
  Uint8ArrayToJS,
} from '../src/protoquery/utils';
import { MsgCreateProject } from './codec/project/tx';
import { Bond, FunctionParam } from './codec/bonds/bonds';
import { DirectSecp256k1HdWallet, Registry } from '@cosmjs/proto-signing';
import {
  defaultRegistryTypes as defaultStargateTypes,
  SigningStargateClient,
} from '@cosmjs/stargate';
import { MsgSend } from './codec/external/cosmos/bank/v1beta1/tx';
import { Coin } from './codec/cosmos/coin';
import { pathToString, sha256 } from '@cosmjs/crypto';
import { base58_to_binary } from 'base58-js';
import { Secp256k1HdWallet, serializeSignDoc } from '@cosmjs/amino';
import { Bech32, toBase64, toUtf8 } from '@cosmjs/encoding';
import { accountFromAny } from './utils/EdAccountHandler';
import { decode } from 'bs58';
import { MsgCreateBond } from './codec/bonds/tx';
import { MsgAddDid } from './codec/did/tx';
import { messageSend } from './clientSdkAlpha';
import { MsgGrantAllowance } from './codec/external/cosmos/feegrant/v1beta1/tx';
import { Timestamp } from './codec/google/protobuf/timestamp';
import { BasicAllowance } from './codec/external/cosmos/feegrant/v1beta1/feegrant';
import { setupStakingExtension } from './protoquery/cosmos';

const sovrin = require('sovrin-did');

// async function CosmosProtoTest() {
//   async function makeClient(
//     rpcUrl: string,
//   ): Promise<[QueryClient, Tendermint34Client]> {
//     const tmClient = await Tendermint34Client.connect(rpcUrl);

//     return [QueryClient.withExtensions(tmClient), tmClient];
//   }

//   const temClient = await makeClient('https://testnet.ixo.earth/rpc/');
//   const qc = new QueryClient(temClient[1]);

//   const bankEx = setupBankExtension(qc);

//   const bankResult = await bankEx.bank.balance(
//     'ixo1ky7wad4d7gjtcy5yklc83geev76cudcevmnhhn',
//     'ixo',
//   );
// }

// async function IXoProtoTest() {
//   const Uint8ArrayData = new Uint8Array();
//   const transactionResult = await transactions.ServiceBroadcastTx(
//     Uint8ArrayData,
//     BroadcastMode.BROADCAST_MODE_UNSPECIFIED,
//   );
// }

// async function IXoProjectTest() {
//   const ProjectResult = await Projects.QueryProjectDoc('Project DID here');
//   // Converting the recived Unit8Array to a readable object
//   const cleanData = Uint8ArrayToJS(ProjectResult.projectDoc.data);
//   // Converting readable object to a Unit8Array
//   const myUint8Array = JsonToArray(cleanData);
// }
// interface messageData {
//   tx: {
//     msg: [
//       {
//         type: string;
//         value: {
//           data: any;
//           txHash: string;
//           senderDid: string;
//           projectDid: string;
//           pubKey: string;
//         };
//       },
//     ];
//   };
// }
// const project = {
//   data:
//     '{"tx":{"msg":[{"type":"project/CreateProject","value":{"data":{"@type":"Project","name":"pol test","description":"A 12-month pilot of an innovative decentralised results-based financing mechanism to scale access to educational technologies for remote learning, to achieve primary education outcomes and build a tokenised education economy.","image":"https://pds_pandora.ixo.world/public/6rej1furasxkpzyqvf6","brand":"Chimple Learning","logo":"https://cellnode-pandora.ixo.world/public/rla7bjq579rktl44ur4","location":"IN","sdgs":["4"],"@context":"https://schema.ixo.foundation/entity:2383r9riuew","entitySchemaVersion":"1.0.0","relayerNode":"did:sov:Rmb6Rd1CU6k74FM2xzy6Do","startDate":"2021-09-15T02:00:00.000Z","endDate":"2022-09-30T02:00:00.000Z","status":"Created","stage":"Delivery","version":{"versionNumber":"1","effectiveDate":"2021-06-16T11:30:00.000Z"},"creator":{"id":"did:ixo:chimple","displayName":"Chimple Learning","logo":"https://cellnode-pandora.ixo.world/public/2cxhgpqb3bcktkjzbio","location":"IN","email":"help@chimple.org","website":"https://chimple.org","mission":"Comprehensive early learning technology solutions designed for all children."},"owner":{"id":"did:ixo:chimple","displayName":"Chimple Learning","logo":"https://cellnode-pandora.ixo.world/public/2cxhgpqb3bcktkjzbio","location":"IN","email":"help@chimple.org","website":"https://chimple.org","mission":"Comprehensive early learning technology solutions designed for all children."},"ddoTags":[{"category":"Project Type","tags":["Education & Awareness"]},{"category":"SDG","tags":["SDG4 – Quality Education"]},{"category":"Stage","tags":["Planning"]},{"category":"Sector","tags":["UBS Zone"]}],"displayCredentials":{"@context":"https://www.w3.org/2018/credentials/v1","items":[]},"headlineMetric":{"claimTemplateId":"did:ixo:EHKrVDLXX8zzgR9eKgAtKg"},"embeddedAnalytics":[{"title":"Live Activity Feed","urls":["https://protect2.fireeye.com/v1/url?k=e1684eb8-bef3766f-e16867c6-000babff4033-caf77e8efbded967&q=1&e=c1f985d7-0c7c-4505-915a-8fbe914dbdaa&u=https%3A%2F%2Fdatastudio.google.com%2Fs%2FpMGwQoBhtrg"]}],"page":{"cid":"g6skhn0kv14l66krzbb","version":"1.0.0"},"entityClaims":{"@context":"https://schema.ixo.world/claims:3r08webu2eou","items":[{"@id":"did:ixo:EHKrVDLXX8zzgR9eKgAtKg","visibility":"Public","title":"Learning Performance","description":"The level of performance a student has achieved at a specific period of the learning program.","targetMin":4000,"targetMax":5000,"startDate":"2021-09-15T02:00:00.000Z","endDate":"2022-09-30T02:00:00.000Z","goal":"Learning Progress Claims","agents":[],"claimEvaluation":[],"claimApproval":[],"claimEnrichment":[]},{"@id":"did:ixo:VUgXN2EfwuEbZKHewMTtny","visibility":"Public","title":"Accountable Use of Funds","description":"A generic form to submit claims of project expenditure items, together with supporting evidence.","targetMin":4000,"targetMax":100,"startDate":"2021-09-15T02:00:00.000Z","endDate":"2022-09-30T02:00:00.000Z","goal":"Expenditure Reported","agents":[],"claimEvaluation":[],"claimApproval":[],"claimEnrichment":[]},{"@id":"did:ixo:EENZQ9tUfkmCMD52Qpt9cs","visibility":"Public","title":"Bank Transactions","description":"A general claim for submitting proof of a bank transaction. Requests upload of a document as evidence for the transaction.","targetMin":1,"targetMax":20,"startDate":"2021-09-15T02:00:00.000Z","endDate":"2022-09-30T02:00:00.000Z","goal":"Accountable Bank Transactions","agents":[],"claimEvaluation":[],"claimApproval":[],"claimEnrichment":[]}]},"linkedEntities":[{"@type":"Investment","id":"did:ixo:PTZRqu8BsxNsdFbMyCxtLQ"}],"fees":{"@context":"https://schema.ixo.world/fees/ipfs3r08webu2eou","items":[]},"nodes":{"@context":"https://schema.ixo.world/nodes/ipfs3r08webu2eou","items":[{"@type":"CellNode","id":"#cellnode","serviceEndpoint":"https://cellnode-pandora.ixo.earth"}]},"liquidity":{"@context":"https://schema.ixo.world/liquidity/ipfs3r08webu2eou","items":[]},"service":[],"linkedResources":[],"createdOn":"2022-07-29T14:44:01Z","createdBy":"did:sov:GV1B2NuW5MvczufYCtCTfk","nodeDid":""},"txHash":"5f80d1012cf309dfff22611bb6c13a579be0f7719e39cf62334a6fb38d2f5275","senderDid":"did:sov:GV1B2NuW5MvczufYCtCTfk","projectDid":"did:ixo:CW3JR99iEVf2KBVNEuLCWv","pubKey":"7GZSSbz2YRutvaaa48QyXffezw3bNS2Y3jLwXdnPK6jd"}}],"fee":{"amount":[{"denom":"uixo","amount":"1000000"}],"gas":"0"},"signatures":[{"signature":"6HK3Pce8gOXgPToCQLWZst7uzXII3TPKARtpWDTmaWiPuAQNH7ZdG1T+0ExVIjkxkZnvr86KiSBT1UslzIoVCA==","pub_key":{"type":"tendermint/PubKeyEd25519","value":"XSKDHrj0QmU/+SWRuvtj63ZNbA4i6nchRnzWr6IMFqw="}}]},"mode":"block"}',
// };

// const test = async () => {
//   const parsed: messageData = JSON.parse(project.data);

//   // console.log('[PROJECT CREATE]', {
//   //   tx: parsed.tx.msg[0].value.txHash,
//   //   senddid: parsed.tx.msg[0].value.senderDid,
//   //   proj: parsed.tx.msg[0].value.projectDid,
//   //   pub: parsed.tx.msg[0].value.pubKey,
//   //   data: JsonToArray(JSON.stringify(parsed.tx.msg[0].value.data)),
//   // });

//   // const rsp = await Projects.QueryProjectDoc('did:ixo:Xcum22jXBqZdmfDehi1giB');
//   // console.log(rsp);
//   console.log('Starting Create Project Transaction');
//   // const rsp = await Projects.TransactionCreateProject(
//   //   parsed.tx.msg[0].value.txHash,
//   //   parsed.tx.msg[0].value.senderDid,
//   //   parsed.tx.msg[0].value.projectDid,
//   //   parsed.tx.msg[0].value.pubKey,
//   //   JsonToArray(JSON.stringify(parsed.tx.msg[0].value.data)),
//   // );
//   const data = new Uint8Array();
//   const rsp = await Projects.TransactionCreateProject(
//     parsed.tx.msg[0].value.txHash,
//     parsed.tx.msg[0].value.senderDid,
//     parsed.tx.msg[0].value.projectDid,
//     parsed.tx.msg[0].value.pubKey,
//     data,
//   );

//   console.log(rsp);

//   //-------------------------------------------------------
// };

//testing the signer

const signer = async () => {
  const myRegistry = new Registry(defaultStargateTypes);
  myRegistry.register('/cosmos.bank.v1beta1.MsgSend', MsgSend); // Replace with your own type URL and Msg class
  // const mnemonic = // Replace with your own mnemonic
  //   'fly must civil seminar keen grit autumn demand balance actress patrol sell';
  // Inside an async function...
  // const wallet = await DirectSecp256k1HdWallet.generate(12, { prefix: 'ixo' });
  // console.log(wallet);
  // const signer = await DirectSecp256k1HdWallet.fromMnemonic(
  //   mnemonic,
  //   { prefix: 'ixo' }, // Replace with your own Bech32 address prefix
  // );

  const fee = {
    amount: [
      {
        denom: 'uixo',
        amount: '120000',
      },
    ],
    gas: '100000',
  };

  const edClient = getPublicKey();

  const resp = await messageSend(
    edClient,
    'ixo107pmtx9wyndup8f9lgj6d7dnfq5kuf3sapg0vx',
    'uixo',
    '5',
    fee,
  );

  console.log(resp);
  // console.log(edClient);
  // const ad = await edClient.getAccounts();
  // console.log(ad);
  // const client = await SigningStargateClient.connectWithSigner(
  //   'https://testnet.ixo.earth/rpc/', // Replace with your own RPC endpoint
  //   //@ts-ignore
  //   edClient,
  //   {
  //     registry: myRegistry,
  //     accountParser: accountFromAny,
  //   },
  // );
  // const ad = await edClient.getAccounts();
  // const myAddress = ad[0].address;
  // const message = {
  //   typeUrl: '/cosmos.bank.v1beta1.MsgSend', // Same as above
  //   value: MsgSend.fromPartial({
  //     fromAddress: myAddress,
  //     toAddress: 'ixo1c2p6gt94zklklz63q6zv4p5a665myng7w5welh',
  //     amount: [
  //       Coin.fromPartial({
  //         denom: 'uixo',
  //         amount: '1000',
  //       }),
  //     ],
  //   }),
  // };
  // const fee = {
  //   amount: [
  //     {
  //       denom: 'uixo', // Use the appropriate fee denom for your chain
  //       amount: '120000',
  //     },
  //   ],
  //   gas: '100000',
  // };
  // console.log('Sending broadcast');
  // // Inside an async function...
  // // This method uses the registry you provided
  // const response = await client.signAndBroadcast(myAddress, [message], fee);
  // console.log(response);
};

// const projectTest = async () => {
//   const myRegistry = new Registry(defaultStargateTypes);
//   myRegistry.register('/project.MsgCreateProject', MsgCreateProject); // Replace with your own type URL and Msg class
//   const parsed: messageData = JSON.parse(project.data);

//   const edClient = getPublicKey();

//   const ad = await edClient.getAccounts();

//   const client = await SigningStargateClient.connectWithSigner(
//     'https://testnet.ixo.earth/rpc/', // Replace with your own RPC endpoint
//     // @ts-ignore
//     edClient,
//     {
//       registry: myRegistry,
//       accountParser: accountFromAny,
//     },
//   );

//   const myAddress = ad[0].address;

//   const projectDID = sovrin.gen();
//   const proj_pub_keyBase64 = decode(projectDID.verifyKey);

//   const message = {
//     typeUrl: '/project.MsgCreateProject', // Same as above
//     value: MsgCreateProject.fromPartial({
//       senderDid: edClient.did,
//       projectDid: 'did:ixo:' + projectDID.did,
//       pubKey: edClient.didDoc.verifyKey,
//       data: JsonToArray(JSON.stringify(parsed.tx.msg[0].value.data)),
//     }),
//   };

//   // const message = {
//   //   typeUrl: '/cosmos.bank.v1beta1.MsgSend', // Same as above
//   //   value: MsgSend.fromPartial({
//   //     fromAddress: myAddress,
//   //     toAddress: 'ixo1c2p6gt94zklklz63q6zv4p5a665myng7w5welh',
//   //     amount: [
//   //       Coin.fromPartial({
//   //         denom: 'uixo',
//   //         amount: '1000',
//   //       }),
//   //     ],
//   //   }),
//   // };

//   const fee = {
//     amount: [
//       {
//         denom: 'uixo', // Use the appropriate fee denom for your chain
//         amount: '1000000',
//       },
//     ],
//     gas: '3000000',
//   };

//   console.log('Sending broadcast');

//   // This method uses the registry you provided
//   const response = await client.signAndBroadcast(myAddress, [message], fee);
//   console.log(response);
// };

// const bondTest = async () => {
//   const myRegistry = new Registry(defaultStargateTypes);
//   myRegistry.register('/bonds.MsgCreateBond', MsgCreateBond); // Replace with your own type URL and Msg class

//   const mnemonic =
//     'creek obvious bamboo ozone dwarf above hill muscle image fossil drastic toy';
//   // Creating diddoc from MM - edkeys
//   const didDoc = sovrin.fromSeed(sha256(toUtf8(mnemonic)).slice(0, 32));
//   const edClient = {
//     mnemonic,
//     didDoc,
//     didPrefix: 'did:ixo:',
//     did: 'did:ixo:' + didDoc.did,

//     async getAccounts() {
//       return [
//         {
//           algo: 'ed25519-sha-256',
//           pubkey: Uint8Array.from(base58_to_binary(didDoc.verifyKey)),
//           address: Bech32.encode(
//             'ixo',
//             sha256(base58_to_binary(didDoc.verifyKey)).slice(0, 20),
//           ),
//         },
//       ];
//     },
//     async signAmino(signerAddress: any, signDoc: any) {
//       const account = (await this.getAccounts()).find(
//         ({ address }) => address === signerAddress,
//       );

//       if (!account)
//         throw new Error(`Address ${signerAddress} not found in wallet`);

//       const fullSignature = sovrin.signMessage(
//         serializeSignDoc(signDoc),
//         didDoc.secret.signKey,
//         didDoc.verifyKey,
//       );
//       const signatureBase64 = toBase64(fullSignature.slice(0, 64));
//       const pub_keyBase64 = base58_to_binary(didDoc.verifyKey);
//       return {
//         signed: signDoc,

//         signature: {
//           signature: signatureBase64,

//           pub_key: {
//             type: 'tendermint/PubKeyEd25519',
//             value: toBase64(pub_keyBase64).toString(),
//           },
//         },
//       };
//     },
//   };
//   const ad = await edClient.getAccounts();

//   const client = await SigningStargateClient.connectWithSigner(
//     'https://testnet.ixo.earth/rpc/', // Replace with your own RPC endpoint
//     // @ts-ignore
//     edClient,
//     {
//       registry: myRegistry,
//       accountParser: accountFromAny,
//     },
//   );

//   const myAddress = ad[0].address;
//   const pub_keyBase64 = decode(didDoc.verifyKey);
//   const bondDID = sovrin.gen();

//   const message = {
//     typeUrl: '/bonds.MsgCreateBond',
//     value: MsgCreateBond.fromPartial({
//       token: 'optimw8',
//       name: 'w-8 - Pilot Alpha Bond 2 - Optimistic',
//       description: 'Pilot Alpha Bond 1 - Optimistic Look a like',
//       creatorDid: didDoc.did,
//       controllerDid: didDoc.did,
//       functionType: 'augmented_function',
//       functionParameters: [
//         FunctionParam.fromPartial({
//           param: 'p0',
//           value: '1.000000000000000000',
//         }),
//         FunctionParam.fromPartial({
//           param: 'theta',
//           value: '0.000000000000000000',
//         }),
//         FunctionParam.fromPartial({
//           param: 'kappa',
//           value: '0.000000000000000000',
//         }),
//         FunctionParam.fromPartial({
//           param: 'd0',
//           value: '1.000000000000000000',
//         }),
//       ],
//       reserveTokens: ['xusd'],
//       txFeePercentage: '0.000000000000000000',
//       exitFeePercentage: '0.000000000000000000',
//       feeAddress: 'ixo1tkq38dndpxmw6pe5dr07j0gp9ctxd0jsu2eu50',
//       reserveWithdrawalAddress: 'ixo1tkq38dndpxmw6pe5dr07j0gp9ctxd0jsu2eu50',
//       maxSupply: Coin.fromPartial({
//         denom: 'optimw8',
//         amount: '1000000000000',
//       }),
//       orderQuantityLimits: [],
//       sanityRate: '0.000000000000000000',
//       sanityMarginPercentage: '0.000000000000000000',
//       allowSells: false,
//       allowReserveWithdrawals: true,
//       alphaBond: true,
//       batchBlocks: '1',
//       outcomePayment: '68100',
//       bondDid: 'did:ixo:' + bondDID.did,
//     }),
//   };

//   const fee = {
//     amount: [
//       {
//         denom: 'uixo', // Use the appropriate fee denom for your chain
//         amount: '1000000',
//       },
//     ],
//     gas: '3000000',
//   };

//   console.log('Sending broadcast');
//   const response = await client.signAndBroadcast(myAddress, [message], fee);
//   console.log(response);
// };

// const didTest = async () => {
//   const myRegistry = new Registry(defaultStargateTypes);
//   myRegistry.register('/did.MsgAddDid', MsgAddDid); // Replace with your own type URL and Msg class

//   const edClient = getPublicKey(
//     'creek obvious bamboo ozone dwarf above hill muscle image fossil drastic toy',
//   );

//   // const t = await Secp256k1HdWallet.fromMnemonic(
//   //   'creek obvious bamboo ozone dwarf above hill muscle image fossil drastic toy',
//   //   { prefix: 'ixo' },
//   // );
//   const ad = await edClient.getAccounts();
//   console.log(ad);

//   // const client = await SigningStargateClient.connectWithSigner(
//   //   'https://testnet.ixo.earth/rpc/', // Replace with your own RPC endpoint
//   //   // @ts-ignore
//   //   edClient,
//   //   {
//   //     registry: myRegistry,
//   //     accountParser: accountFromAny,
//   //   },
//   // );

//   // const myAddress = ad[0].address;

//   // const message = {
//   //   typeUrl: '/did.MsgAddDid',
//   //   value: MsgAddDid.fromPartial({
//   //     did: edClient.didSov,
//   //     pubKey: edClient.didDoc.verifyKey,
//   //   }),
//   // };

//   // const fee = {
//   //   amount: [
//   //     {
//   //       denom: 'uixo', // Use the appropriate fee denom for your chain
//   //       amount: '1000000',
//   //     },
//   //   ],
//   //   gas: '3000000',
//   // };

//   // console.log('Sending broadcast');
//   // const response = await client.signAndBroadcast(myAddress, [message], fee);
//   // console.log(response);
// };

// export const feeGrant = async (Address: string, fee: any, grantee: string) => {
//   const signer = await DirectSecp256k1HdWallet.fromMnemonic(
//     'basket mechanic myself capable shoe then home magic cream edge seminar artefact',
//     { prefix: 'ixo' },
//   );
//   const balance = await checkBalance(Address);
//   console.log(balance);
//   if (Number(balance.amount) === 0) {
//     const myRegistry = new Registry(defaultStargateTypes);
//     myRegistry.register('/cosmos.feegrant.v1beta1.Msg', MsgGrantAllowance); // Replace with your own type URL and Msg class
//     const ad = await signer.getAccounts();

//     const client = await SigningStargateClient.connectWithSigner(
//       'https://devnet.ixo.earth/rpc/',
//       signer,
//       {
//         registry: myRegistry,
//       },
//     );

//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const expirationdatemilli = tomorrow.getTime(); // milliseconds
//     const expirationdatemilliexpirationdateseconds = new Date(
//       expirationdatemilli,
//     ).getSeconds(); // seconds
//     const expirationdatenano = expirationdatemilli * 1000000000; // nanoseconds
//     console.log(expirationdatenano);

//     console.log(expirationdatemilliexpirationdateseconds);

//     const myAddress = ad[0].address;
//     const Allowance = BasicAllowance.fromPartial({
//       spendLimit: [
//         Coin.fromPartial({
//           denom: 'ixo',
//           amount: '10',
//         }),
//       ],
//       expiration: Timestamp.fromPartial({
//         seconds: expirationdatemilliexpirationdateseconds.toString(),
//         nanos: expirationdatenano,
//       }),
//     });

//     const message = {
//       typeUrl: '/cosmos.feegrant.v1beta1.Msg',
//       value: MsgGrantAllowance.fromJSON({
//         grantee: grantee,
//         granter: myAddress,
//         allowance: Allowance,
//       }),
//     };

//     const response = await client.signAndBroadcast(myAddress, [message], fee);

//     console.log(response);
//   } else {
//     console.log('Balance is not empty');
//   }
// };

// const checkBalance = async (address: string) => {
//   async function makeClient(
//     rpcUrl: string,
//   ): Promise<[QueryClient, Tendermint34Client]> {
//     const tmClient = await Tendermint34Client.connect(rpcUrl);
//     return [QueryClient.withExtensions(tmClient), tmClient];
//   }
//   const temClient = await makeClient('https://testnet.ixo.earth/rpc/');
//   const qc = new QueryClient(temClient[1]);
//   const bankEx = setupBankExtension(qc);

//   const bankResult = await bankEx.bank.balance(address, 'ixo');

//   return bankResult;
// };

// const fee = {
//   amount: [
//     {
//       denom: 'uixo', // Use the appropriate fee denom for your chain
//       amount: '1000000',
//     },
//   ],
//   gas: '3000000',
// };

// feeGrant(
//   'ixo1pmtyywrldcze4dt2yqluc8dxa7hams5qcny9r6',
//   fee,
//   'ixo1pmtyywrldcze4dt2yqluc8dxa7hams5qcny9r6',
// );

const stakingTest = async () => {
  const ProjectResult = await 'Project DID here';

  async function makeClient(
    rpcUrl: string,
  ): Promise<[QueryClient, Tendermint34Client]> {
    const tmClient = await Tendermint34Client.connect(rpcUrl);

    return [QueryClient.withExtensions(tmClient), tmClient];
  }

  const temClient = await makeClient('https://testnet.ixo.earth/rpc/');
  const qc = new QueryClient(temClient[1]);

  const stakeEx = setupStakingExtension(qc);

  const test = await stakeEx.staking.validators('BOND_STATUS_BONDED');

  const delegatorDelegationsResult = await stakeEx.staking.delegatorDelegations(
    'ixo1dsq92yggqs9enskg8wzdln4w68ketlg99x7mmt',
  );
  const delegatorUnbondingDelegationsResult = await stakeEx.staking.delegatorUnbondingDelegations(
    'ixo1dsq92yggqs9enskg8wzdln4w68ketlg99x7mmt',
  );
  const delegatorValidatorsResult = await stakeEx.staking.delegatorValidators(
    'ixo1dsq92yggqs9enskg8wzdln4w68ketlg99x7mmt',
  );

  // console.log('test', test);

  console.log(
    'delegatorDelegationsResult',
    Number(delegatorDelegationsResult.delegationResponses[0].balance.amount) /
      Math.pow(10, 6) +
      Number(delegatorDelegationsResult.delegationResponses[1].balance.amount) /
        Math.pow(10, 6),
  );
  console.log(
    'delegatorUnbondingDelegationsResult',
    delegatorUnbondingDelegationsResult,
  );
  console.log('delegatorValidatorsResult', delegatorValidatorsResult);
};

stakingTest();
