import { Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes as defaultStargateTypes } from '@cosmjs/stargate';
import { Coin } from './codec/cosmos/coin';
import { MsgSend } from './codec/external/cosmos/bank/v1beta1/tx';
import { SigningStargateClient } from './utils/customClient';
import { accountFromAny } from './utils/EdAccountHandler';

interface fee {
  amount: [
    {
      denom: string; // Use the appropriate fee denom for your chain
      amount: string;
    },
  ];
  gas: string;
}

export const messageSend = async (
  signer: any,
  toAddress: string,
  denom: string,
  amountInUixo: string,
  fee: fee,
) => {
  const myRegistry = new Registry(defaultStargateTypes);
  myRegistry.register('/cosmos.bank.v1beta1.MsgSend', MsgSend);

  const ad = await signer.getAccounts();

  const client = await SigningStargateClient.connectWithSigner(
    'https://testnet.ixo.earth/rpc/',
    signer,
    {
      registry: myRegistry,
      accountParser: accountFromAny,
    },
  );

  const myAddress = ad[0].address;
  const message = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: MsgSend.fromPartial({
      fromAddress: myAddress,
      toAddress: toAddress,
      amount: [
        Coin.fromPartial({
          denom: denom,
          amount: amountInUixo,
        }),
      ],
    }),
  };

  const response = await client.signAndBroadcast(myAddress, [message], fee);
  return response;
};
