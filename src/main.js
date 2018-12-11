const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}



class Block {
    constructor(timestamp, transactions, previousHash='') {
        // this.index = index;
        this.timestamp = this.timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        

        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block Mined: ' + this.hash);
        console.log('Nonce was calculated: ' + this.nonce + ' times');
    }
}



class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    createGenesisBlock() {
        return new Block(Date.now().toString(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(mineRewardAddress) {
        console.log('\n Starting the miner..');

        if(this.pendingTransactions.length > 1 || this.chain.length == 1) {
            let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
            block.mineBlock(this.difficulty);

            console.log('Block successfully mined..');
            this.chain.push(block);

            // this.pendingTransactions = [];
            this.pendingTransactions = [
                new Transaction(null, mineRewardAddress, this.miningReward)
            ];
        } else console.log("----No Transaction created: Bad Request.----");
        
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        console.log("\n\nValidating Chain");
        for(let i=1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            console.log("\n--------- block"+(i+1)+" ---------");
            console.log("currentBlock.hash: " + currentBlock.hash);
            console.log("currentBlock.calculateHash(): " + currentBlock.calculateHash());
            console.log("currentBlock.previousHash: " + currentBlock.previousHash);
            console.log("previousBlock.hash: " + previousBlock.hash);

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// The birth of CRYPTO-CURRENCY
let sonaCoin = new BlockChain();

// Transaction1 - Creates block2
sonaCoin.createTransaction(new Transaction("address1", "Rish-address", 100));
sonaCoin.minePendingTransactions('Rish-address');

// Check failure of MiningTransactions when no actual transactions exist
sonaCoin.minePendingTransactions('Rish-address');
// MiningRewards are recorded as pending-transactions and are distributed when next transaction happens
console.log('\nBalance of Rish is: ' + sonaCoin.getBalanceOfAddress('Rish-address'));

// Transaction2 - Creates block3
sonaCoin.createTransaction(new Transaction("Rish-address", "address1", 50));
sonaCoin.minePendingTransactions('Rish-address');
console.log('\nBalance of Rish is: ' + sonaCoin.getBalanceOfAddress('Rish-address'));


// Transaction3 - Creates block3
sonaCoin.createTransaction(new Transaction("address2", "address1", 50));
sonaCoin.minePendingTransactions('Rish-address');
console.log('\nBalance of Rish is: ' + sonaCoin.getBalanceOfAddress('Rish-address'));

console.log('\nIs BlockChain valid? ' + sonaCoin.isChainValid());

sonaCoin.minePendingTransactions('Rish-address');


console.log("\n\n\n----Tampering blockchain----")
// Example1 - Tampering amount
// sonaCoin.chain[1].transactions = {amount: 1000};


// Example2 - Tampering amount and recalculating hash
sonaCoin.chain[1].transactions = {amount: 1000};
sonaCoin.chain[1].hash = sonaCoin.chain[1].calculateHash();



console.log('\nIs BlockChain valid? ' + sonaCoin.isChainValid());