import { ethers, Contract } from 'ethers';
import IPLPrediction from './contracts/IPLPrediction.json';

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log("signerAddress: " + signerAddress);
        console.log("version: " + window.ethereum.networkVersion);
        const iplPrediction = new Contract(
          IPLPrediction.networks[window.ethereum.networkVersion].address,
          IPLPrediction.abi, signer);

        resolve({signerAddress, iplPrediction});
      }
      resolve({signerAddress: undefined, iplPrediction: undefined});
    });
  });

export default getBlockchain;