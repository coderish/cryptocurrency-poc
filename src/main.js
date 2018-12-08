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
    }
}



class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.now().toString(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);

    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(mineRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined..');
        this.chain.push(block);

        // this.pendingTransactions = [];
        this.pendingTransactions = [
            new Transaction(null, mineRewardAddress, this.miningReward)
        ];
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
        for(let i=1; i<this.chain.length - 1; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

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

let sonaCoin = new BlockChain();

sonaCoin.createTransaction(new Transaction("address1", "address2", 100));
sonaCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log('\n Starting the miner..');
sonaCoin.minePendingTransactions('Rishi-address');

console.log('\nBalance of Rishi is: ' + sonaCoin.getBalanceOfAddress('Rishi-address'));

console.log('\n Starting the miner again..');
sonaCoin.minePendingTransactions('Rishi-address');


console.log('\nBalance of Rishi is: ' + sonaCoin.getBalanceOfAddress('Rishi-address'));

// console.log('Mining block1...');
// sonaCoin.addBlock(new Block(1, Date.now().toString(), {amount: 500}));

// console.log('Mining block2...');
// sonaCoin.addBlock(new Block(2, Date.now().toString(), {amount: 100}));

// console.log('Mining block3...');
// sonaCoin.addBlock(new Block(3, Date.now().toString(), {amount: 200}));

// console.log('Is BlockChain valid? ' + sonaCoin.isChainValid());

// sonaCoin.chain[1].transactions = {amount: 1000};
// sonaCoin.chain[1].hash = sonaCoin.chain[1].calculateHash();
// console.log('Is BlockChain valid? ' + sonaCoin.isChainValid());
// console.log(JSON.stringify(sonaCoin, null, 4));