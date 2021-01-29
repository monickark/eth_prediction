import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';
import { Pie } from 'react-chartjs-2';

const SIDE = { CSK : 0, MI : 1 };

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [iplPrediction, setIPLPrediction] = useState(undefined);
  const [betPredictions, setBetPredictions] = useState(undefined);
  const [myBets, setMyBets] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { signerAddress, iplPrediction } = await getBlockchain();
      console.log("signerAddress1 : " + signerAddress);
      console.log("IPLPrediction1 : " + iplPrediction);
      console.log("csk bets1 : " + iplPrediction.bets(SIDE.CSK));
      const bets = await Promise.all([
        iplPrediction.bets(SIDE.CSK),
        iplPrediction.bets(SIDE.MI)
      ]);      
      console.log("bets : " + bets.toString());
      const betPredictions = {
      	labels: [
      		'MI',
      		'CSK',
      	],
      	datasets: [{
      		data: [bets[1].toString(), bets[0].toString()],
      		backgroundColor: [
            '#FF6384',
            '#36A2EB',
      		],
      		hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
      		]
      	}]
      };
      const myBets = await Promise.all([
        iplPrediction.betsPerGambler(signerAddress, SIDE.CSK),
        iplPrediction.betsPerGambler(signerAddress, SIDE.MI),
      ]);
      setMyBets(myBets);
     // console.log(myBets[0].toString());
      setBetPredictions(betPredictions);
      setIPLPrediction(iplPrediction);
    };
    init();
  }, []);

  if(
    typeof iplPrediction === 'undefined'
    || typeof betPredictions === 'undefined'
    || typeof myBets === 'undefined'
  ) {
    return 'Loading...';
  }

  const placeBet = async (side, e) => {
    console.log("Side : "+ side);
    console.log("value : "+ e.target.elements[0].value);
    e.preventDefault();
    await iplPrediction.placeBet(
      side, 
      {value: e.target.elements[0].value}
    );
  };

  const withdrawGain = async () => {
    await iplPrediction.withdrawGain();
  };

  const reportResult = async (_winner, _loser) => {
    console.log("******* reportResult ********");
    console.log("_winner : " + _winner);
    console.log("_loser : " + _loser);
    await iplPrediction.reportResult(_winner, _loser);
  };

  return (
    <div className='container'>

      <div className='row'>
        <div className='col-sm-12'>
          {/* <h1 className='text-center'>Prediction Market</h1> */}
          <div className="">
            <h1 className="display-4 text-center">IPL 2020 PREDICTION</h1>
            {/* <p className="lead text-center">Current odds</p> */}
            <div className="text-center">
               <Pie data={betPredictions} />
            </div>
          </div>
        </div>
      </div>
      <hr/>
      
      <h1 className="display-4 text-center">USER BET DETAILS</h1>
      <div className='row'>
        <div className='col-sm-6'>
          <div className="card">
            <img src='mi.jpg' />
            <div className="card-body">
              <h5 className="card-title">BET AMT:</h5>
              <form className="form-inline" onSubmit={e => placeBet(SIDE.MI, e)}>
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Bet amount (ether)"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary mb-2"
                >
                  Submit
                </button>
                <div className="bets">My Bets for MI: {myBets[0].toString()} ETH (wei)</div>
              </form>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <div className="card">
            <img src='csk.png' />
            <div className="card-body">
              <h5 className="card-title">BET AMT:</h5>
              <form className="form-inline" onSubmit={e => placeBet(SIDE.CSK, e)}>
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Bet amount (ether)"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary mb-2"
                >
                  Submit
                </button>
                <div className="bets">My Bets for CSK: {myBets[1].toString()} ETH (wei)</div>
              </form>
            </div>
          </div>
        </div>
      </div>

     <hr/>
     
     <h1 className="display-4 text-center">ADMIN</h1>
     <div className='container text-center'>
      <div className='row'>
        <div className='col-sm-6'>
          <h2>Report result</h2>
          <button 
            type="submit" 
            className="btn btn-lg btn-danger mb-2"
            onClick={e => reportResult(SIDE.CSK, SIDE.MI)}
          >
            Report Result
          </button>
        </div>
        <div className='col-sm-6'>
          <h2>Withdraw Gain</h2>
          <button 
            type="submit" 
            className="btn btn-lg btn-warning mb-2"
            onClick={e => withdrawGain()}
          >
            Withdraw Gain
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;