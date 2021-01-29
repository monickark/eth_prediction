pragma solidity ^0.7.3;

contract IPLPrediction {
    enum Side { MI,CSK }
    bool public gameFinished;
    address public oracle;

    struct Result {
        Side winner;
        Side loser;
    }
    Result result;
    mapping(Side => uint) public bets;
    mapping(address => mapping(Side => uint)) public betsPerGambler;

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function placeBet(Side _side) external payable {
        require(gameFinished == false, 'election is finished');
        bets[_side] += msg.value;
        betsPerGambler[msg.sender][_side] += msg.value;
    }

    function withdrawGain() external {
        uint gamblerBet = betsPerGambler[msg.sender][result.winner];
        require(gamblerBet > 0, 'You do not have any winning bet');
        require(gameFinished == true, 'election have finished');
        uint gain = gamblerBet + bets[result.loser]*gamblerBet / bets[result.winner];
        betsPerGambler[msg.sender][Side.MI] = 0;
        betsPerGambler[msg.sender][Side.CSK] = 0;
        msg.sender.transfer(gain);
    }
    
    function reportResult(Side _winner, Side _loser) external {
        require(oracle == msg.sender, 'only oracle');
        require(gameFinished == false, 'election not yet finished');
        result.winner = _winner;
        result.loser = _loser;
        gameFinished = true;
    }
}