pragma solidity ^0.4.10;

contract Web {
    struct File {
        bool init;
        uint8 compression;
        uint8 mime;
        bytes data;
    }

    struct Domain {
        bool init;
        address owner;
        mapping(string => File) files;
    }

    mapping(string => Domain) domains;

    address owner;
    uint domainPrice;

    function Web(uint _domainPrice) {
        owner = msg.sender;
        domainPrice = _domainPrice;
    }

    function shutdown() {
        if(msg.sender != owner) {
            throw;
        }

        selfdestruct(owner);
    }

    function collectFunds() {
        if(msg.sender != owner) {
            throw;
        }

        owner.transfer(this.balance);
    }

    function registerDomain(string name) payable external {
        if(domains[name].init == true || msg.value < domainPrice) {
            throw;
        }

        domains[name].init = true;
        domains[name].owner = msg.sender;
    }

    function transferDomain(string name, address newOwner) external {
        if(domains[name].owner != msg.sender) {
            throw;
        }

        domains[name].owner = newOwner;
    }

    function pushFile(string domainName, string fileName, uint8 compression, uint8 mime, bytes data) external {
        if(domains[domainName].owner != msg.sender) {
            throw;
        }

        domains[domainName].files[fileName].init = true;
        domains[domainName].files[fileName].compression = compression;
        domains[domainName].files[fileName].mime = mime;
        domains[domainName].files[fileName].data = data;
    }

    function getFile(string domainName, string fileName) external constant returns (uint8 compression, uint8 mime, bytes data) {
        if(domains[domainName].init != true || domains[domainName].files[fileName].init != true) {
            throw;
        }

        File memory file = domains[domainName].files[fileName];
        return (file.compression, file.mime, file.data);
    }
}
