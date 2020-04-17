pragma solidity >=0.4.22 <0.7.0;
import "./Base.sol";

contract Survey {
    modifier onlyCreator() {
        require(msg.sender == creator, "Only Creator Can Proccess");
        _;
    }
    modifier inState(address sender, AccountState _state) {
        require(accountStruct[sender].state == _state, "Invalid state.");
        _;
    }
    modifier accountExist(address sender) {
        require(accountStruct[sender].isExist, "Account must Exist");
        _;
    }
    enum AccountState {
        init,
        assignPublicKey,
        readyToSend,
        alreadySend,
        verify,
        problem
    }
    enum GroupRole {leaf, branch, root}
    enum ContractState {init, assignPublicKey, sendData, verfiy, close}

    struct AccountStruct {
        //address account
        AccountState state;
        bool isExist;
        uint8 groupId;
        bytes sendData; //128 135 142 149 bytes
        bytes problemData;
    }
    struct AccountGroup {
        //group id
        GroupRole role;
        bool isExist;
        bool isAssignPublicKey;
        address[] accounts;
        bytes publicKey;
        uint256 accountLength;
        uint256 publicKeySize;
        uint256 sendDataCount;
        uint256 verfiyCount;
    }

    Base baseContract;
    address baseContractAddress;
    uint256 surveyId;

    address public creator;
    uint8 public groupSize;
    uint256 public numOfMember;
    bytes public creatorPublicKey;
    uint256 public createPublicKeySize;
    uint256 public numOfAssignPublicKey;
    uint256 public numOfVerify;
    ContractState public currentState;

    mapping(address => AccountStruct) accountStruct;
    mapping(uint8 => AccountGroup) accountGroup;

    constructor() public {
        creator = msg.sender;
        currentState = ContractState.init;
    }
    function getBaseInfo()
        public
        view
        returns (address contractAddress, uint256 id, uint256 count)
    {
        contractAddress = baseContractAddress;
        id = surveyId;
        count = numOfMember;
    }
    function getAccountInfo(address _address)
        public
        view
        accountExist(_address)
        returns (
            uint8 groupId,
            AccountState state,
            uint256 publicKeySize,
            GroupRole role
        )
    {
        AccountStruct storage sender = accountStruct[_address];
        AccountGroup storage group = accountGroup[sender.groupId];
        groupId = sender.groupId;
        state = sender.state;
        publicKeySize = group.publicKeySize;
        role = group.role;
    }
    function getAccountIsExist(address target) public view returns (bool) {
        return accountStruct[target].isExist;
    }
    function isNeedToAssignPublicKey(address target)
        public
        view
        returns (bool)
    {
        return (accountGroup[accountStruct[target].groupId].role !=
            GroupRole.leaf);
    }
    function getPublicKeySize(address target) public view returns (uint256) {
        return accountGroup[accountStruct[target].groupId].publicKeySize;
    }

    function assignPublicKey(bytes memory publicKeyHex)
        public
        accountExist(msg.sender)
        inState(msg.sender, AccountState.assignPublicKey)
    {
        AccountStruct storage sender = accountStruct[msg.sender];
        AccountGroup storage group = accountGroup[sender.groupId];
        require(
            group.publicKeySize == publicKeyHex.length,
            "Key size doesn't match"
        );
        require(!group.isAssignPublicKey, "PublicKey Already Assign");
        require(group.role != GroupRole.leaf, "Leaf Role");

        group.publicKey = publicKeyHex;
        accountStruct[msg.sender].state = AccountState.readyToSend;
        group.isAssignPublicKey == true;
        numOfAssignPublicKey++;

        //2 is group that need to assgin account
        if (numOfAssignPublicKey == 2) {
            currentState = ContractState.sendData;
        }
    }
    function sendData(bytes memory _data)
        public
        accountExist(msg.sender)
        inState(msg.sender, AccountState.readyToSend)
    {
        AccountStruct storage sender = accountStruct[msg.sender];
        AccountGroup storage group = accountGroup[sender.groupId];
        require(
            isMemberAlreadySendData(sender.groupId),
            "You account cannot send yet"
        );
        //check key size
        sender.sendData = _data;
        sender.state = AccountState.alreadySend;
        group.sendDataCount++;

        if (group.role == GroupRole.root) {
            currentState = ContractState.verfiy;
        }
    }

    function sendVerify()
        public
        accountExist(msg.sender)
        inState(msg.sender, AccountState.alreadySend)
    {
        AccountStruct storage sender = accountStruct[msg.sender];

        sender.state = AccountState.verify;
        numOfVerify++;
        if (numOfMember == numOfVerify) {
            currentState = ContractState.close;
        }

    }
    function getData(address account) public view returns (bytes memory) {
        return accountStruct[account].sendData;
    }
    function isMemberAlreadySendData(uint8 groupId) public view returns (bool) {
        //instate sendData
        //if group exits
        if (accountGroup[groupId].role == GroupRole.leaf) {
            return true;
        }
        return
            accountGroup[groupId - 1].accounts.length ==
            accountGroup[groupId - 1].sendDataCount;
    }
    function getPublicKey(uint8 groupId) public view returns (bytes memory) {
        return accountGroup[groupId].publicKey;
    }
    function getGroupAccount(uint8 _groupId, uint256 _cursor, uint256 _length)
        public
        view
        returns (
            address[] memory accounts,
            AccountState[] memory stateList,
            uint256 newCursor
        )
    {
        AccountGroup storage group = accountGroup[_groupId];
        uint256 length = _length;
        if (length > group.accounts.length - _cursor) {
            length = group.accounts.length - _cursor;
        }

        accounts = new address[](length);
        stateList = new AccountState[](length);
        for (uint256 i = 0; i < length; i++) {
            accounts[i] = group.accounts[_cursor + i];
            stateList[i] = accountStruct[group.accounts[_cursor + i]].state;
        }
        return (accounts, stateList, _cursor + length);
    }
    function assignContract(
        address _baseAddress,
        uint256 _surveyId,
        address[] memory _accounts,
        uint256 _publicKeyLength,
        bytes memory _publicKeyHex
    ) public onlyCreator {
        bytes32 getHash = Base(_baseAddress).getHashAccount(_surveyId);
        bytes32 inputHash = keccak256(
            abi.encodePacked(_accounts, _baseAddress, creator)
        );
        require(getHash == inputHash, "input arugment doesn't match");
        // require(_publicKey.length == _publicKeySize, "key size not match");
        uint256 length = _accounts.length;
        baseContractAddress = _baseAddress;
        baseContract = Base(_baseAddress);
        surveyId = _surveyId;

        groupSize = 3;
        creatorPublicKey = _publicKeyHex;
        createPublicKeySize = (_publicKeyLength / 2) - 34;
        //from current to
        // PCKS-1
        createGroup(0, GroupRole.leaf, 0);
        createGroup(1, GroupRole.branch, _publicKeyLength + 22);
        createGroup(2, GroupRole.root, _publicKeyLength + 11);

        for (uint256 i = 0; i < length; i++) {
            addAccounts(_accounts[i], 0, AccountState.readyToSend);
        }
        //radom change role
        uint256 _random = pesudoRamdom() % length;
        address member1 = _accounts[_random];
        address member2 = _accounts[(_random + 1) % length];
        accountStruct[member1].groupId = 1;
        accountStruct[member2].groupId = 2;
        accountStruct[member1].state = AccountState.assignPublicKey;
        accountStruct[member2].state = AccountState.assignPublicKey;

        for (uint256 i = 0; i < length; i++) {
            addAccountToGroup(_accounts[i]);
        }
        numOfMember = length;
        currentState = ContractState.assignPublicKey;
    }

    function createGroup(
        uint8 _groupId,
        GroupRole _role,
        uint256 _publicKeySize
    ) private {
        AccountGroup memory newAccountGroup;
        newAccountGroup.isExist = true;
        newAccountGroup.publicKeySize = _publicKeySize;
        newAccountGroup.role = _role;
        accountGroup[_groupId] = newAccountGroup;
    }
    function addAccounts(address _account, uint8 _groupId, AccountState state)
        private
    {
        accountStruct[_account].isExist = true;
        accountStruct[_account].groupId = _groupId;
        accountStruct[_account].state = state;
    }
    function addAccountToGroup(address _account) private {
        uint8 _groupId = accountStruct[_account].groupId;
        accountGroup[_groupId].accounts.push(_account);
    }
    function pesudoRamdom() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        blockhash(block.number - 1)
                    )
                )
            );
    }
}
