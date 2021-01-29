const IPLPrediction = artifacts.require('IPLPrediction');

const Side = { CSK: 0,  MI: 1 };

module.exports = async function (deployer, _network, addresses) {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  await deployer.deploy(IPLPrediction, oracle);
  const iplPrediction = await IPLPrediction.deployed();
  await iplPrediction.placeBet(
    Side.CSK, 
   // {from: gambler1, value: web3.utils.toWei('1')}
   {from: gambler1, value: 1}
  );
  await iplPrediction.placeBet(
    Side.CSK, 
  //  {from: gambler2, value: web3.utils.toWei('1')}
  {from: gambler1, value: 1}
  );
  await iplPrediction.placeBet(
    Side.CSK, 
   // {from: gambler3, value: web3.utils.toWei('2')}
   {from: gambler1, value: 2}
  );
  await iplPrediction.placeBet(
    Side.MI, 
   // {from: gambler4, value: web3.utils.toWei('1')}
   {from: gambler1, value: 1}
  );
};