pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

/// @title ASSET Lending Pool
/// @author Fraser Scott
contract Pool is ERC1155Receiver {
    enum LoanState {Listed, Borrowed, Collected}

    struct Loan {
        address verse;
        uint256 assetID;
        uint256 cost;
        uint256 deposit;
        uint256 duration;
        uint256 entry;
        uint256 startTime;
        address loaner;
        address borrower;
        LoanState state;
    }

    Loan[] public loans;

    ERC20 private erc20_token;

    constructor(address _erc20_address) ERC1155Receiver() {
        erc20_token = ERC20(_erc20_address);
    }

    function onERC1155Received(
        address _operator,
        address _from,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external override returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address,address,uint256,uint256,bytes)"
                )
            );
    }

    function onERC1155BatchReceived(
        address _operator,
        address _from,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external override returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"
                )
            );
    }

    /// @notice Put an ASSET into the lending pool.
    /// @param _assetID The Sandbox asset ID.
    function createLoan(
        address _verse,
        uint256 _assetID,
        uint256 _cost,
        uint256 _deposit,
        uint256 _duration
    ) public {
        loans.push(
            Loan(
                _verse,
                _assetID,
                _cost,
                _deposit,
                _duration,
                block.timestamp,
                0,
                msg.sender,
                address(0),
                LoanState.Listed
            )
        );

        ERC1155(_verse).safeTransferFrom(
            msg.sender,
            address(this),
            _assetID,
            1,
            ""
        );
    }

    /// @notice Accept a loan, take an ASSET out of the pool.
    /// @param _loanIndex The index in the loan array.
    function acceptLoan(uint256 _loanIndex) public {
        Loan storage loan = loans[_loanIndex];
        require(
            loan.state == LoanState.Listed,
            "This ASSET is not in the pool"
        );
        require(
            block.timestamp < loan.entry + loan.duration,
            "Loan duration has passed"
        );

        loan.state = LoanState.Borrowed;
        loan.startTime = block.timestamp;
        loan.borrower = msg.sender;

        erc20_token.transferFrom(loan.borrower, address(this), loan.deposit);
        ERC1155(loan.verse).safeTransferFrom(
            address(this),
            msg.sender,
            loan.assetID,
            1,
            ""
        );
    }

    /// @notice Return a loan, put an ASSET back into the pool.
    /// @param _loanIndex The index in the loan array.
    function returnLoan(uint256 _loanIndex) public {
        Loan storage loan = loans[_loanIndex];
        require(msg.sender == loan.borrower, "You are not the borrower");
        require(
            loan.state == LoanState.Borrowed,
            "This ASSET is not currently borrowed"
        );

        loan.state = LoanState.Listed;

        erc20_token.transfer(loan.borrower, loan.deposit);
        erc20_token.transferFrom(
            loan.borrower,
            loan.loaner,
            loan.cost * (block.timestamp - loan.startTime)
        );

        ERC1155(loan.verse).safeTransferFrom(
            loan.borrower,
            address(this),
            loan.assetID,
            1,
            ""
        );
    }

    /// @notice Collect ASSET from the pool.
    /// @param _loanIndex The index in the loan array.
    function collectLoan(uint256 _loanIndex) public {
        Loan storage loan = loans[_loanIndex];
        require(msg.sender == loan.loaner, "You are not the loaner");
        require(
            loan.state == LoanState.Listed,
            "This ASSET is not in the pool"
        );

        loan.state = LoanState.Collected;

        ERC1155(loan.verse).safeTransferFrom(
            address(this),
            loan.loaner,
            loan.assetID,
            1,
            ""
        );
    }

    /// @notice Loaner takes borrowers deposit if they failed to return the ASSET.
    /// @param _loanIndex The index in the loan array.
    function timeoutLoan(uint256 _loanIndex) public {
        Loan storage loan = loans[_loanIndex];
        require(msg.sender == loan.loaner);
        require(
            loan.state == LoanState.Borrowed,
            "This ASSET is not currently borrowed"
        );
        require(
            block.timestamp > loan.entry + loan.duration,
            "Loan duration has not passed"
        );

        loan.state = LoanState.Collected;

        erc20_token.transfer(loan.loaner, loan.deposit);
    }

    /// @notice Returns every loan.
    /// @dev Data is flattened to be more easily read on the frontend.
    function getLoans()
        public
        view
        returns (
            uint256[] memory costs,
            uint256[] memory deposits,
            uint256[] memory durations,
            uint256[] memory startTimes,
            uint256[] memory entrys,
            uint256[] memory ids,
            address[] memory loaners,
            address[] memory borrowers,
            LoanState[] memory states
        )
    {
        costs = new uint256[](loans.length);
        deposits = new uint256[](loans.length);
        durations = new uint256[](loans.length);
        startTimes = new uint256[](loans.length);
        entrys = new uint256[](loans.length);
        ids = new uint256[](loans.length);
        loaners = new address[](loans.length);
        borrowers = new address[](loans.length);
        states = new LoanState[](loans.length);

        for (uint256 i = 0; i < loans.length; i++) {
            costs[i] = loans[i].cost;
            deposits[i] = loans[i].deposit;
            durations[i] = loans[i].duration;
            entrys[i] = loans[i].entry;
            startTimes[i] = loans[i].startTime;
            ids[i] = loans[i].assetID;
            loaners[i] = loans[i].loaner;
            borrowers[i] = loans[i].borrower;
            states[i] = loans[i].state;
        }
    }
}
