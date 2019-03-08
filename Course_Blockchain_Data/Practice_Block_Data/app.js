/**
 * Importing BlockExplorer API to search Block Data
 */
const be = require('blockexplorer');

/**
 *  Explore Block Data function
 * @param {*} index 
 * 
 * Start by requesting the hash then request the block and use console.log()
 * 
 */
async function getBlock(index) {
  //add your code here
  try {
    const hash = await be.blockIndex(index);
    const hashAux = JSON.parse(hash).blockHash 
    const block = await be.block(hashAux);
    console.log(block);
  } catch (err) {
    console.log(err);
  }
}

/**
 * Function to execute the `getBlock(index)` function
 * Nothing to implement here.
 */

(function theLoop (i) {
	setTimeout(function () {
        getBlock(i);
        i++;
		if (i < 3) theLoop(i);
	}, 3000);
  })(0);