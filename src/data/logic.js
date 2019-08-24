const cards = require('./cards.json');

let players = [
    {
        name:"Player One",
        cards:[]
    }
    ,
    {
        name:"Player Two",
        cards:[]
    }
];

let deck = [];
let cutter ={};
let played=[];
let nextPlayer ="";
let gameOver ="";
let winner = "";


//shuffle
//distribute 7 cards to each player
// Get cutter that is not 7

// play player one

// only play with type, text, or Ace match

// if play ace select waht next player should play

// pick from deck.

// resuffle played cards to deck if deck is empty

// on play j of 8 add another chance to play again

//on play 7 if total cards of plyer is less than 25. calculate winner with less totla numbe rof cards

// on play 2 next player should pick 2 cards from the deck if the next card is not also a 2

// if playing cards is done player is winner

