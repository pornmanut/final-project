pragma solidity >=0.4.22 <0.7.0;
import "./Base.sol";
//check key
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
        assignSharedKey,
        sendData,
        verify,
        problem
    }
    //0 1 2 3
    struct AccountStruct {
        //address account
        bool isExist;
        uint8 groupId;
        bytes sendData; //128 135 142 149 bytes
        bytes publicKey; //128 bytes phase inti
        bytes sharedKey; // < 128 bytes phase sharedKey
        bytes problemData;
        AccountState state;
    }
    struct AccountGroup {
        //group id
        bool isExist;
        uint8 next;
        uint8 from;
        address[] accounts;
        uint256 publicKeySize;
        uint256 sendDataCount;
        uint256 sharedKeyCount;
        uint256 publicKeyCount;
        uint256 verfiyCount;
    }
    Base baseContract;
    bool surveyCanVerify;
    bool isSurveyAssign;
    address public creator;
    uint8 public groupSize;
    uint256 public numOfMember;
    address baseAddress;
    uint256 surveyId;
    uint8 lastGroup;
    bytes contractPublicKey;

    mapping(address => AccountStruct) accountStruct;
    mapping(uint8 => AccountGroup) accountGroup;
    //contract public key
    constructor() public {
        creator = msg.sender;
    }
    function getAccountInfo(address _address)
        public
        view
        accountExist(_address)
        returns (uint256 groupId, AccountState state, uint256 publicKeySize)
    {
        AccountStruct storage sender = accountStruct[_address];
        AccountGroup storage group = accountGroup[sender.groupId];
        groupId = sender.groupId;
        state = sender.state;
        publicKeySize = group.publicKeySize;
    }
    function getContractPublicKey() public view returns (bytes memory) {
        return contractPublicKey;
    }
    function getPublicKey(address _address)
        public
        view
        accountExist(_address)
        returns (bytes memory)
    {
        return accountStruct[_address].publicKey;
    }
    //getData inline assembly

    function getGroupInfo(uint8 _groupId)
        public
        view
        returns (
            uint8 next,
            uint8 from,
            uint256 publicKeySize,
            uint256 publicKeyCount,
            uint256 sendDataCount,
            uint256 verifyCount,
            uint256 size
        )
    {
        AccountGroup storage group = accountGroup[_groupId];
        next = group.next;
        from = group.from;
        publicKeyCount = group.publicKeyCount;
        sendDataCount = group.sendDataCount;
        verifyCount = group.verfiyCount;
        size = group.accounts.length;
        publicKeySize = group.publicKeySize;
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
    function assignBaseContract(
        address _baseAddress,
        uint256 _surveyId,
        address[] memory _accounts,
        uint256 _publicKeySize,
        bytes memory _publicKey
    ) public onlyCreator {
        bytes32 getHash = Base(_baseAddress).getHashAccount(_surveyId);
        bytes32 inputHash = keccak256(
            abi.encodePacked(_accounts, _baseAddress, creator)
        );
        require(getHash == inputHash, "input arugment doesn't match");
        // require(_publicKey.length == _publicKeySize, "key size not match");

        baseAddress = _baseAddress;
        baseContract = Base(_baseAddress);
        surveyId = _surveyId;

        groupSize = 4;
        lastGroup = groupSize - 1;
        isSurveyAssign = true;

        contractPublicKey = _publicKey;
        //from current to
        // PCKS-1
        createGroup(0, 0, 1, _publicKeySize);
        createGroup(0, 1, 2, _publicKeySize + 33);
        createGroup(1, 2, 3, _publicKeySize + 22);
        createGroup(2, 3, 3, _publicKeySize + 11);

        uint256 length = _accounts.length;
        for (uint256 i = 0; i < length; i++) {
            addAccounts(_accounts[i], 0);
        }

        //radom change role
        uint256 _random = pesudoRamdom() % length;

        address member1 = _accounts[_random];
        address member2 = _accounts[(_random + 1) % length];
        address member3 = _accounts[(_random + 2) % length];

        accountStruct[member1].groupId = 1;
        accountStruct[member2].groupId = 2;
        accountStruct[member3].groupId = 3;

        for (uint256 i = 0; i < _accounts.length; i++) {
            addAccountToGroup(_accounts[i]);
        }
        numOfMember = _accounts.length;
    }
    function assignPublicKey(bytes memory _publickey)
        public
        accountExist(msg.sender)
        inState(msg.sender, AccountState.init)
    {
        require(
            accountGroup[accountStruct[msg.sender].groupId].publicKeySize ==
                _publickey.length,
            "Key size doesn't match"
        );
        //check size key
        accountStruct[msg.sender].publicKey = _publickey;
        accountStruct[msg.sender].state = AccountState.assignPublicKey;
        accountGroup[accountStruct[msg.sender].groupId].publicKeyCount++;
    }
    function assginSharedKey(address _target, bytes memory _sharedKey)
        public
        accountExist(msg.sender)
        accountExist(_target)
        inState(_target, AccountState.assignPublicKey)
    {
        //check size key
        accountStruct[_target].sharedKey = _sharedKey;
        accountStruct[_target].state = AccountState.assignSharedKey;
        accountGroup[accountStruct[_target].groupId].sharedKeyCount++;

        if (accountStruct[msg.sender].groupId == lastGroup) {
            accountStruct[msg.sender].state = AccountState.assignSharedKey;
            accountGroup[accountStruct[msg.sender].groupId].sharedKeyCount++;
        }
    }
    function isCanSend(uint8 _groupId) public view returns (bool canSend) {
        uint8 next = accountGroup[_groupId].next;
        uint8 from = accountGroup[_groupId].from;
        while (accountGroup[next].isExist) {
            if (
                accountGroup[next].accounts.length !=
                accountGroup[next].publicKeyCount
            ) {
                return false;
            }
            next = accountGroup[next].next;
        }
        if (from != _groupId) {
            return
                accountGroup[from].sendDataCount ==
                accountGroup[from].accounts.length;
        }
        return true;
    }
    function sendData(bytes memory _data)
        public
        accountExist(msg.sender)
        inState(msg.sender, AccountState.assignPublicKey)
    {
        AccountStruct storage sender = accountStruct[msg.sender];
        require(isCanSend(sender.groupId), "You account cannot send yet");
        //check key size
        sender.sendData = _data;
        sender.state = AccountState.sendData;
        accountGroup[sender.groupId].sendDataCount++;

        if (sender.groupId == lastGroup) {
            surveyCanVerify = true;
        }
    }
    function verfiy()
        public
        accountExist(msg.sender)
        inState(msg.sender, AccountState.sendData)
    {
        require(surveyCanVerify, "Cannot verify yet");
        AccountStruct storage sender = accountStruct[msg.sender];

        sender.state = AccountState.verify;
        accountGroup[sender.groupId].verfiyCount++;
    }

    function addAccounts(address _account, uint8 _groupId) private {
        accountStruct[_account].isExist = true;
        accountStruct[_account].groupId = _groupId;
        accountStruct[_account].state = AccountState.init;
    }
    function addAccountToGroup(address _account) private {
        uint8 _groupId = accountStruct[_account].groupId;
        accountGroup[_groupId].accounts.push(_account);
    }
    function createGroup(
        uint8 _from,
        uint8 _groupId,
        uint8 _next,
        uint256 _publicKeySize
    ) private {
        require(!accountGroup[_groupId].isExist, "Group must not Exist");
        AccountGroup memory newAccountGroup;
        newAccountGroup.isExist = true;
        newAccountGroup.from = _from;
        newAccountGroup.next = _next;
        newAccountGroup.publicKeySize = _publicKeySize;
        accountGroup[_groupId] = newAccountGroup;
    }
    function pesudoRamdom() private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            );
    }

}
