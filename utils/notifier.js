const {getRandomDelay,delayAFunction} = require('./common');

// notify use random delay
async function notifierLoop(array, func) {
    for (let index = 0; index < array.length; index++) {
        const delay = getRandomDelay();
        console.log(`\n[Delay System] - wait for ${(delay / 1000).toFixed(2)} seconds...`);

        await new Promise(resolve => setTimeout(resolve, delay));
        func(array[index], index);
    }
}

// var scream = function screamWord(word) {
//     console.log(word);    
// }

// var words = ['hey', 'you', 'get', 'out', 'of', 'here' ];

// notifierLoop(words,scream)

module.exports = {
    notifierLoop: notifierLoop
};