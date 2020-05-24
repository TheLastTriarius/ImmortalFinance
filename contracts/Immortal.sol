pragma solidity 0.6 .6;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
import "https://github.com/aave/flashloan-box/blob/Remix/contracts/aave/FlashLoanReceiverBase.sol";
import "https://github.com/aave/flashloan-box/blob/Remix/contracts/aave/ILendingPoolAddressesProvider.sol";
import "https://github.com/aave/flashloan-box/blob/Remix/contracts/aave/ILendingPool.sol";



abstract contract WETH {
    function deposit() virtual public payable;
}

abstract contract UniSwap2Router {
    function getAmountsIn(uint amountOut, address[] memory path) virtual public view returns(uint[] memory amounts);

    function getAmountsOut(uint amountIn, address[] memory path) virtual public view returns(uint[] memory amounts);


    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) virtual
    external
    payable
    returns(uint[] memory amounts);

    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) virtual
    external
    returns(uint[] memory amounts);

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) virtual external returns(uint[] memory amounts);
}


abstract contract Uniswap2Factory {
    function getPair(address tokenA, address tokenB) virtual external view returns(address pair);
}


abstract contract Uniswap2Pair {
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) virtual external;

    function token0() virtual public returns(address);

    function token1() virtual public returns(address);
}

abstract contract LendingPool {
    function deposit(address _reserve, uint256 _amount, uint16 _referralCode) virtual public payable;

    function borrow(address _reserve, uint256 _amount, uint256 _interestRateMode, uint16 _referralCode) virtual public;

    function flashLoan(address _receiver, address _reserve, uint256 _amount, bytes memory _params) virtual public;

    function repay(address _reserve, uint256 _amount, address payable _onBehalfOf) virtual public;

    function getUserAccountData(address _user) virtual public view returns(
        uint256 totalLiquidityETH,
        uint256 totalCollateralETH,
        uint256 totalBorrowsETH,
        uint256 totalFeesETH,
        uint256 availableBorrowsETH,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
    );

    function getUserReserveData(address _reserve, address _user) virtual public view returns(
        uint256 currentATokenBalance,
        uint256 currentBorrowBalance,
        uint256 principalBorrowBalance,
        uint256 borrowRateMode,
        uint256 borrowRate,
        uint256 liquidityRate,
        uint256 originationFee,
        uint256 variableBorrowIndex,
        uint256 lastUpdateTimestamp,
        bool usageAsCollateralEnabled
    );

}

abstract contract AToken {
    function redeem(uint256 _amount) virtual public;

    function underlyingAssetAddress() virtual public view returns(address);
}




contract ImmortalFactory {
    mapping(address => address) public users;
    address public operator;

    constructor() public {
        //newProtection(130, 135);
        operator = msg.sender;
    }

    function newProtection(uint _minCollaterization, uint _healTo) public returns(address) {
        //require(users[msg.sender] == address(0));
        users[msg.sender] = address(new Immortal(msg.sender, operator, _minCollaterization, _healTo));
        return users[msg.sender];
    }

    function getProtectionByUser(address _user) public view returns(address) {
        return users[_user];
    }


}

//0xff795577d9ac8bd7d90ee22b6c1703490b6512fd - kovan DAI
contract Immortal /*is FlashLoanReceiverBase*/ {
    using SafeMath
    for uint256;


    address payable public user;
    address public operator;


    uint public minCollaterization = 160e18;
    uint public healTo = 165e18;

    LendingPool public lendingPool = LendingPool(0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c); //kovan
    address lendingPoolCoreAddress = 0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45; //kovan
    //address aaveSecretContractAddress = 0xBfA2079C41C3b714A64481535718C69fB7FD7f9e; //kovan
    //UniswapFactory uniswapFactory = UniswapFactory(0xD3E51Ef092B2845f10401a0159B2B96e8B6c3D30); // kovan
    UniSwap2Router uni2 = UniSwap2Router(0xf164fC0Ec4E93095b804a4795bBe1e041497b92a); //kovan
    Uniswap2Factory uni2F = Uniswap2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); //kovan
    address wethAddress = 0xd0A1E359811322d97991E03f863a0C30C2cF029C; //kovan


    address[6] public protectionLayers;

    bool awaitingCallback;
    
    
    modifier callback () {
      require(awaitingCallback, "Unexpected callback");
      _;
      awaitingCallback = false;
    }
    
    modifier userAccess () {
        require(msg.sender == user, "User access error");
        _;
    }
    
    modifier operatorAccess () {
        require(msg.sender == operator || msg.sender == user || msg.sender == address(this), "Operator access error");
        _;
    }

    receive() external payable {

    }

    constructor(address payable _owner, address _operator, uint _minCollaterization, uint _healTo) /*FlashLoanReceiverBase(0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5)*/ public payable {

        user = _owner;
        operator = _operator;
        minCollaterization = _minCollaterization;
        healTo = _healTo;
    }

    function setOperator(address _operator) public userAccess {
        operator = _operator;
    }

    function setParams(uint _minCollaterization, uint _healTo) public userAccess {
        minCollaterization = _minCollaterization;
        healTo = _healTo;
    }



    function setLayer(uint layer, address _tokenAddress) public userAccess {
        protectionLayers[layer] = _tokenAddress;
    }

    function getAllLayers() public view returns(address[6] memory) {
        return protectionLayers;
    }

    /*function withdrawToken(address _tokenAddress, uint _tokenAmount) public us {
        IERC20(_tokenAddress).transfer(user, _tokenAmount);
    }*/

    function getCollaterizationPerc() public view returns(uint) {
        (, uint collateral, uint debt, , , , , ) = lendingPool.getUserAccountData(user);
        if (debt <= 0) return uint(-1);
        return collateral.mul(100).div(debt);
    }



    function isHealthy() public view returns(bool) {
        if (getCollaterizationPerc() < minCollaterization) return false;
        return true;
    }

    function debt(address _borrowTokenAddress) public view returns(uint) {
        (, uint debt, , , , , uint fee, , , ) = lendingPool.getUserReserveData(_borrowTokenAddress, user);
        return debt.add(fee); //.mul(1000).div(999);
    }




    function debtToHeal(address _borrowTokenAddress) public view returns(uint debtToHeal) {
        if (isHealthy()) return 0;
        uint debt = debt(_borrowTokenAddress);
        uint prec = 10000;
        uint ratio = prec.sub(getCollaterizationPerc().mul(prec).div(healTo));
        debtToHeal = debt.mul(ratio).div(prec);
    }

    function heal(address _aTokenAddress, address _borrowTokenAddress, bool _rebalance, uint _iterationLimit) public operatorAccess {
        require(!_rebalance || _iterationLimit >= 6); //restrict rebalance stage, if we limited iteration count
        require(!isHealthy(), "we are healthy enough");
        uint debt = debtToHeal(_borrowTokenAddress);
        uint left = _liquidateLayers(_borrowTokenAddress, debt, _iterationLimit);
        uint gained = IERC20(_borrowTokenAddress).balanceOf(address(this));

        if (gained > 0) {
            (, , , , , , uint brokenFee, , , ) = lendingPool.getUserReserveData(_borrowTokenAddress, user);
            if (brokenFee > 0) {
                require(IERC20(_borrowTokenAddress).allowance(user, lendingPoolCoreAddress) >= brokenFee, 'Failed because of Aave originationFee charge bug'); //fail if user dont have/approve enough token to aave core contract
                IERC20(_borrowTokenAddress).transfer(user, brokenFee);

            }
            IERC20(_borrowTokenAddress).approve(lendingPoolCoreAddress, uint(-1));
            if(gained > 0) lendingPool.repay(_borrowTokenAddress, gained, user);
        }
        if (left > 0 && _rebalance) {
            rebalance(_aTokenAddress, _borrowTokenAddress, debt);
        }
    }



    function _liquidateLayers(address _borrowTokenAddress, uint debt, uint _iterationLimit) internal returns(uint left) {
        left = debt;
        uint it = 0;
        for (uint8 i = 0; i <= protectionLayers.length - 1; i++) {
            require(it <= _iterationLimit);
            if (protectionLayers[i] == address(0)) continue;
 
            (left, , ) = _liquidate(protectionLayers[i], _borrowTokenAddress, debt);
            it++;
        }
    }

    function _liquidate(address _liquidationToken, address _borrowTokenAddress, uint debt) internal returns(uint left, uint sold, uint bought) {
        left = debt;
        uint balance;
        if (_liquidationToken == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            balance = address(this).balance;
        } else {
            balance = IERC20(_liquidationToken).balanceOf(user);
            if (IERC20(_liquidationToken).allowance(user, address(this)) < balance) balance = IERC20(_liquidationToken).allowance(user, address(this));
        }
        if (balance <= 0) return (left, 0, 0);
        uint toSell = getSellInputAmount(_liquidationToken, _borrowTokenAddress, left);
        if (toSell > balance) toSell = balance;
        if (_liquidationToken != 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) IERC20(_liquidationToken).transferFrom(user, address(this), toSell);
        uint bought = _sellAsset(_liquidationToken, toSell, _borrowTokenAddress);
        if (bought > left) left = 0;
        else left.sub(bought);
        if (left <= 0 || debt.mul(1000).div(left) <= 1) return (0, sold, bought); //zero or 0.1%
        return (left, sold, bought);
    }

    function _uniswapPreparePath(address inputAddress, address outputAddress) public view returns(address[] memory) {
        if (inputAddress == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) inputAddress = wethAddress;
        if (outputAddress == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) outputAddress = wethAddress;
        if (inputAddress == wethAddress || outputAddress == wethAddress) {
            address[] memory path = new address[](2);
            path[0] = inputAddress;
            path[1] = outputAddress;
            return path;
        } else {
            address[] memory path = new address[](3);
            path[0] = inputAddress;
            path[1] = wethAddress;
            path[2] = outputAddress;
            return path;
        }
    }

    function getSellInputAmount(address inputAddress, address outputAddress, uint outputAmount) public view returns(uint) {
        if(inputAddress == outputAddress) return outputAmount; //return same if we try to calc trade for same token
        address[] memory path = _uniswapPreparePath(inputAddress, outputAddress);
        uint inputAmount = uni2.getAmountsIn(outputAmount, path)[0];
        return inputAmount;
    }

    function _sellAsset(address inputAddress, uint inputAmount, address outputAddress) internal returns(uint) {
        uint bought = 0;
        if(inputAddress == outputAddress) return inputAmount; // do nothing if we try to trade same token
        address[] memory path = _uniswapPreparePath(inputAddress, outputAddress);

        if (inputAddress != 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE && outputAddress != 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            IERC20(inputAddress).approve(address(uni2), uint(-1));
            bought = uni2.swapExactTokensForTokens(inputAmount, 0, path, address(this), uint(-1))[1];
        } else if (inputAddress == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            bought = uni2.swapExactETHForTokens.value(inputAmount)(0, path, address(this), uint(-1))[1];
        } else if (outputAddress == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            IERC20(inputAddress).approve(address(uni2), uint(-1));
            bought = uni2.swapExactTokensForETH(inputAmount, 0, path, address(this), uint(-1))[1];
        }
        return bought;
    }

    function rebalance(address _aTokenAddress, address _borrowTokenAddress, uint _debtToRepay) public userAccess {
        address underlyingAddress = AToken(_aTokenAddress).underlyingAssetAddress();
        address inputAddress = underlyingAddress;
        address outputAddress = _borrowTokenAddress;
        if (underlyingAddress == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) inputAddress = wethAddress;
        if (_borrowTokenAddress == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) outputAddress = wethAddress;


        uint _flashBorrow = _debtToRepay;
        if (underlyingAddress != 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE && outputAddress != 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            outputAddress = wethAddress;
            _flashBorrow = getSellInputAmount(wethAddress, _borrowTokenAddress, _debtToRepay);
        }


        address pair = uni2F.getPair(inputAddress, outputAddress);

        bytes memory params = abi.encode(_aTokenAddress, _borrowTokenAddress, _debtToRepay, outputAddress, pair);
        awaitingCallback = true;
        if (Uniswap2Pair(pair).token0() == inputAddress) Uniswap2Pair(pair).swap(0, _flashBorrow, address(this), params);
        else Uniswap2Pair(pair).swap(_flashBorrow, 0, address(this), params);
    }


    function _rebalanceRecv(address _aTokenAddress, address _borrowTokenAddress, uint _debtToRepay, address _flashTokenAddress, address _flashPairAddress, uint _flashAmount) internal {
        if (_flashTokenAddress != _borrowTokenAddress) {
            _sellAsset(_flashTokenAddress, _flashAmount, _borrowTokenAddress);
        }

        (, , , , , , uint brokenFee, , , ) = lendingPool.getUserReserveData(_borrowTokenAddress, user);
        if (brokenFee > 0) {
            require(IERC20(_borrowTokenAddress).allowance(user, lendingPoolCoreAddress) >= brokenFee, 'Failed because of Aave originationFee charge bug'); //fail if user dont have/approve enough token to aave core contract
            IERC20(_borrowTokenAddress).transfer(user, brokenFee);
        }

        IERC20(_borrowTokenAddress).approve(lendingPoolCoreAddress, uint(-1));
        lendingPool.repay(_borrowTokenAddress, _debtToRepay, user);

        uint balance = IERC20(_aTokenAddress).balanceOf(user);
        if (IERC20(_aTokenAddress).allowance(user, address(this)) < balance) balance = IERC20(_aTokenAddress).allowance(user, address(this));
        if (balance <= 0) return;
        address underlyingAddress = AToken(_aTokenAddress).underlyingAssetAddress();


        uint collateralToSell = getSellInputAmount(underlyingAddress, _flashTokenAddress, _flashAmount);
        if (balance < collateralToSell) collateralToSell = balance;


        if (collateralToSell > 0) {
            IERC20(_aTokenAddress).transferFrom(user, address(this), collateralToSell);
            AToken(_aTokenAddress).redeem(collateralToSell);
        }

        address repayTokenAddress = underlyingAddress;
        if (underlyingAddress == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            WETH(wethAddress).deposit.value(collateralToSell)();
            repayTokenAddress = wethAddress;
        }
        IERC20(repayTokenAddress).transfer(_flashPairAddress, collateralToSell);
    }


    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external callback {
        uint _flashAmount = amount0;
        if (amount0 == 0) _flashAmount = amount1;

        (address _aTokenAddress, address _borrowTokenAddress, uint _debtToRepay, address _flashTokenAddress, address _flashPairAddress) = abi.decode(data, (address, address, uint, address, address));

        _rebalanceRecv(_aTokenAddress, _borrowTokenAddress, _debtToRepay, _flashTokenAddress, _flashPairAddress, _flashAmount);


    }

}