pragma solidity >=0.4.22 <0.7.0;

//commitment?
//payable?

contract Base {
    address public creator;
    struct AccountInfo {
        bool isExist;
        bool hasRight; //for next generation
    }
    struct SurveyRequest {
        bool isExist;
        bool isOpen;
        bool isCreateHash;
        bool isAssignAddress;
        address surveyAddress;
        bytes32 approvedAccountHash;
        bytes message;
        uint256 numOfApproved;
        address[] accountAddress;
        mapping(address => AccountInfo) accountMap;
    }
    uint256 public surveySize;
    mapping(uint256 => SurveyRequest) surveyMap;

    constructor() public {
        creator = msg.sender;
    }
    function createSurveyRequest(bytes memory _message) public onlyCreator {
        SurveyRequest memory survey;
        survey.isExist = true;
        survey.isOpen = true;
        survey.message = _message;
        surveyMap[surveySize] = survey;
        surveySize++;
    }
    function requestAssignToSurvey(uint256 _id) public {
        SurveyRequest storage survey = surveyMap[_id];

        require(survey.isExist, "Survey Must Exist");
        require(survey.isOpen, "Survey Close");
        require(!survey.accountMap[msg.sender].isExist, "Account already Add");

        AccountInfo memory newAccountInfo;
        newAccountInfo.isExist = true;

        survey.accountAddress.push(msg.sender);
        survey.accountMap[msg.sender] = newAccountInfo;
    }
    function regisAccountFromRequestPool(
        uint256 _id,
        address[] memory _accounts
    ) public onlyCreator {
        SurveyRequest storage survey = surveyMap[_id];
        require(survey.isExist, "Survey Must Exist");
        require(survey.isOpen, "Survey Close");

        for (uint256 i = 0; i < _accounts.length; i++) {
            AccountInfo storage accountInfo = survey.accountMap[_accounts[i]];
            if (!accountInfo.isExist) {
                revert("Have an account does't not exist");
            }
            if (accountInfo.hasRight) {
                survey.numOfApproved--;
            } else {
                survey.numOfApproved++;
            }
            accountInfo.hasRight = !accountInfo.hasRight;
        }
    }
    function closeSurvey(uint256 _id) public onlyCreator {
        SurveyRequest storage survey = surveyMap[_id];
        require(survey.isExist, "Survey Must Exist");
        require(
            survey.numOfApproved >= 3,
            "Approved member must need more than 4"
        );
        surveyMap[_id].isOpen = false;
        setHashRightAccount(_id);
    }
    function assginSurveyAddress(uint256 _id, address _address)
        public
        onlyCreator
    {
        SurveyRequest storage survey = surveyMap[_id];
        survey.isAssignAddress = true;
        survey.surveyAddress = _address;
    }
    function getSurveyAddress(uint256 _id)
        public
        view
        returns (bool isAssign, address assignAddress)
    {
        SurveyRequest storage survey = surveyMap[_id];
        require(survey.isExist, "Survey Must Exist");
        isAssign = survey.isAssignAddress;
        assignAddress = survey.surveyAddress;
    }
    function getAccountsAddress(uint256 _id, uint256 _cursor, uint256 _length)
        public
        view
        returns (
            address[] memory accountList,
            bool[] memory rightList,
            uint256 newCursor
        )
    {
        SurveyRequest storage survey = surveyMap[_id];

        uint256 length = _length;
        if (length > survey.accountAddress.length - _cursor) {
            length = survey.accountAddress.length - _cursor;
        }
        accountList = new address[](length);
        rightList = new bool[](length);
        for (uint256 i = 0; i < length; i++) {
            address account = survey.accountAddress[_cursor + i];
            accountList[i] = account;
            rightList[i] = survey.accountMap[account].hasRight;
        }
        return (accountList, rightList, _cursor + length);
    }
    function getApprovedAccount(uint256 _id)
        public
        view
        returns (address[] memory accountList)
    {
        SurveyRequest storage survey = surveyMap[_id];

        accountList = new address[](survey.numOfApproved);
        uint256 index = 0;
        for (uint256 i = 0; i < survey.accountAddress.length; i++) {
            AccountInfo storage accountInfo = survey.accountMap[survey
                .accountAddress[i]];
            if (accountInfo.hasRight) {
                accountList[index] = survey.accountAddress[i];
                index++;
            }
        }
        return accountList;
    }
    function setHashRightAccount(uint256 _id) public onlyCreator {
        SurveyRequest storage survey = surveyMap[_id];
        require(!survey.isOpen, "Survey Must Close");
        survey.approvedAccountHash = keccak256(
            abi.encodePacked(getApprovedAccount(_id), address(this), creator)
        );
        survey.isCreateHash = true;
    }
    function getHashAccount(uint256 _id) public view returns (bytes32) {
        SurveyRequest storage survey = surveyMap[_id];
        require(survey.isCreateHash, "Survey Must AssignHash");
        return survey.approvedAccountHash;
    }
    function getSurveyRequest(uint256 _id)
        public
        view
        returns (
            bool isOpen,
            bool isAssignAddress,
            bytes memory message,
            uint256 requestLength,
            uint256 approvedLength,
            address surveyAddress
        )
    {
        SurveyRequest storage survey = surveyMap[_id];
        require(survey.isExist, "Survey doesn't exist");
        isOpen = survey.isOpen;
        isAssignAddress = survey.isAssignAddress;
        message = survey.message;
        requestLength = survey.accountAddress.length;
        approvedLength = survey.numOfApproved;
        surveyAddress = survey.surveyAddress;
    }
    modifier onlyCreator() {
        require(msg.sender == creator, "Only Creator Can Proccess");
        _;
    }
}
