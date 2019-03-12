/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

  constructor() {
    this.bd = new LevelSandbox.LevelSandbox();
    this.generateGenesisBlock();
  }

  // Helper method to create a Genesis Block (always with height= 0)
  // You have to options, because the method will always execute when you create your blockchain
  // you will need to set this up statically or instead you can verify if the height !== 0 then you
  // will not create the genesis block
  generateGenesisBlock() {
    // Add your code here
    const genBlock = new Block.Block('this is the genesis block');
    this.addBlock(genBlock);
  }

  // Get block height, it is a helper method that return the height of the blockchain
  getBlockHeight() {
    // Add your code here
    return this.bd.getBlocksCount();
  }

  // Add new block
  async addBlock (newBlock) {
    // Add your code here
    // get number of blocks in store
    const blockHeight = await this.getBlockHeight();
    // assign new block time
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    // get previous block hash, assign to newBlock
    if (blockHeight > 0) {
      newBlock.height = blockHeight;
      let prevBlock = await this.getBlock(blockHeight - 1);
      let prevHash = prevBlock.hash;
      newBlock.previousHashBlock = prevHash
    }
    // hash newBlock
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // save newBlock
    return this.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
  }

  // Get Block By Height
  getBlock(blockHeight) {
    // Add your code here
    return this.bd.getLevelDBData(blockHeight)

  }

  // Validate if Block is being tampered by Block Height
  async validateBlock(height) {
    // Add your code here
    const blockObj = await this.getBlock(height);
    const blockObjCopy = {...blockObj};
    blockObjCopy.hash = '';
    const newHash = SHA256(JSON.stringify(blockObjCopy)).toString();
    const existingHash = blockObj.hash;
    
    return new Promise((resolve, reject) => {
      if (newHash === existingHash) {
        resolve(true)
      } else {
        reject(false);
      }
    })
  }

  // Validate Blockchain
  async validateChain() {
    // Add your code here
    const promises = [];
    const blockHeight = await this.getBlockHeight();

    for (let i = 0; i < blockHeight; i++) {
      const validateResult = await this.validateBlock(i);
      promises.push(validateResult);
    }
    const results = await Promise.all(promises);

    const result = results.every(el => el);

    return new Promise((resolve, reject) => {
      if (result) {
        resolve(true);
      } else {
        reject(false);
      }
    })
  }

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    let self = this;
    return new Promise( (resolve, reject) => {
      self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
        resolve(blockModified);
      }).catch((err) => { console.log(err); reject(err)});
    });
  }
}

module.exports.Blockchain = Blockchain;
