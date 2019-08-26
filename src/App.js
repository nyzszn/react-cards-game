import React from "react";
import "./App.css";
import _ from "lodash";
import update from "immutability-helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faGem, faSpad } from "@fortawesome/free-solid-svg-icons";
const cards = require("./data/cards.json");

/*

//shuffle
//distribute 7 cards to each player
// Get cutter that is not 7

// play player one

// only play with type, text, or Ace match  <FontAwesomeIcon icon="coffee" />

// if play ace select waht next player should play

// pick from deck.

// resuffle played cards to deck if deck is empty

// on play j of 8 add another chance to play again

//on play 7 if total cards of plyer is less than 25. calculate winner with less totla numbe rof cards

// on play 2 next player should pick 2 cards from the deck if the next card is not also a 2

// if playing cards is done player is winner


*/

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOne: {
        name: "Player One",
        cards: []
      },
      playerTwo: {
        name: "Player Two",
        cards: []
      },
      deck: [],
      cutter: {},
      played: [],
      nextPlayer: "",
      gameOver: true,
      winner: "",
      requiredType:""
    };
  }

  componentDidMount() {
    this._start();
    // only play with type, text, or Ace match

    // if play ace select waht next player should play

    // pick from deck.

    // resuffle played cards to deck if deck is empty

    // on play j of 8 add another chance to play again

    //on play 7 if total cards of plyer is less than 25. calculate winner with less totla numbe rof cards

    // on play 2 next player should pick 2 cards from the deck if the next card is not also a 2

    // if playing cards is done player is winner
  }
  _shuffle = async () => {
    let shuffledCards = cards.sort(() => Math.random() - 0.5);
    console.log("Shuffling");
    this.setState(
      {
        deck: shuffledCards
      },
      () => {
        this._distributeCardsEvenly();
      }
    );
  };
  _distributeCardsEvenly = async () => {
    const p1 = [];
    const p2 = [];
    let cutter = {};
    let whatsLeftOftheDeck = this.state.deck;
    this.state.deck.map((v, k) =>
      k <= 13 ? (k % 2 ? p1.push(v) : p2.push(v)) : ""
    );
    whatsLeftOftheDeck = _.difference(whatsLeftOftheDeck, p1);
    whatsLeftOftheDeck = _.difference(whatsLeftOftheDeck, p2);
    let counter = 0;
    while (whatsLeftOftheDeck[counter]) {
      whatsLeftOftheDeck.sort(() => Math.random() - 0.5);
      console.log("xx");
      if (whatsLeftOftheDeck[0].number != 7) {
        console.log(whatsLeftOftheDeck[0]);
        cutter = whatsLeftOftheDeck[0];
        break;
      }
      counter++;
    }
    whatsLeftOftheDeck = _.difference(whatsLeftOftheDeck, [cutter]);

    let playerOne = this.state.playerOne;
    let playerTwo = this.state.playerTwo;

    playerOne.cards = p1;
    playerTwo.cards = p2;
    let nextPlayer = _.shuffle([playerOne, playerTwo]);

    this.setState({
      playerOne,
      playerTwo,
      deck: whatsLeftOftheDeck,
      cutter,
      nextPlayer: nextPlayer[0].name,
      gameOver: false
    });
  };
  _playNext = async (player, card) => {
    console.log("player", player);
    //check to see if right player should play
    if (player.name === this.state.nextPlayer) {
      let currentPlayedCards = this.state.played;
      const lastPlayedCard =
        this.state.played.length > 0
          ? this.state.played[this.state.played.length - 1]
          : [];
      if (this.state.played.length > 0) {
        console.log("card", card);
        console.log("lastplayed card", lastPlayedCard);
        if (
          card.text == lastPlayedCard.text ||
          card.type == lastPlayedCard.type
        ) {
          console.log("Good to go!");

          currentPlayedCards.push(card);
          let nplayer =
            player.name === "Player One"
              ? this.state.playerOne
              : this.state.playerTwo;
          nplayer.cards = _.difference(player.cards, [card]);
          this.setState({
            played: currentPlayedCards,
            [player.name === "Player One"
              ? this.state.playerOne
              : this.state.playerTwo]: nplayer,
            nextPlayer:
              player.name === "Player One" ? "Player Two" : "Player One"
          });
        } else {
          console.log("Not the right card to play");
        }
      } else if (this.state.played.length == 0) {
        currentPlayedCards.push(card);
        let nplayer =
          player.name === "Player One"
            ? this.state.playerOne
            : this.state.playerTwo;
        nplayer.cards = _.difference(player.cards, [card]);
        switch( card ){
          case card.number == 2:
          // ask next player to pick 2 cards of play a an equevalent card`
            this.setState({
              played: currentPlayedCards,
              cardsToPick:2,
              [player.name === "Player One"
                ? this.state.playerOne
                : this.state.playerTwo]: nplayer,
              nextPlayer: player.name === "Player One" ? "Player Two" : "Player One"
          });
          case card.number == 8 || card.number == 11:
          // next player is themselves
          this.setState({
            played: currentPlayedCards,
            [player.name === "Player One"
              ? this.state.playerOne
              : this.state.playerTwo]: nplayer,
            nextPlayer: player.name === "Player One" ? "Player One" : "Player Two"
        });
          case card.number == 15:
          // ask next player to play type of choice next
          this.setState({
            played: currentPlayedCards,
            requiredType:this.state.requiredType,
            [player.name === "Player One"
              ? this.state.playerOne
              : this.state.playerTwo]: nplayer,
            nextPlayer: player.name === "Player One" ? "Player One" : "Player Two"
        });
          case card.number == 7 && card.type == this.state.cutter.type:
          // calculate if current player has to number of cards less that 25 in total if so then calculate each player who has the least to be the winner
          let totalCount = 0;
          this.state[player.name].cards.map((v, k)=>
              totalCount +=v.number
          );
          if(totalCount <25){
            this.setState({
              played: currentPlayedCards,
              requiredType:this.state.requiredType,
              [player.name === "Player One"
                ? this.state.playerOne
                : this.state.playerTwo]: nplayer,
              nextPlayer: player.name === "Player One" ? "Player One" : "Player Two"
          });
          // cut function to run after this
          }
          else{
            console.log("Total is less than 25");
            return false;
          }
          
          default:
            this.setState({
              played: currentPlayedCards,
              [player.name === "Player One"
                ? this.state.playerOne
                : this.state.playerTwo]: nplayer,
              nextPlayer: player.name === "Player One" ? "Player Two" : "Player One"
          });
        }
      } else {
        console.log("You ain't supposed to play 2");
        return false;
      }
      //if true Migrate card from player cards to played cards at the end
    } else {
      console.log("You ain't supposed to play 1");
      return false;
    }
  };
  _pickFromDeck = async (player, number =1) => {
    let cardsToAdd =[];
    for (var i = 0; i < number; i++) {
      cardsToAdd.push(this.state.deck[i]);
    }
    // remove cards from deck
    // add cards to player cards
    // upddate state not to require pick from cards

  };
  _regroupDeckFromPlayed = async () => {};
  _cut = async () => {};
  _start = async () => {
    console.log("Starting Game");
    //empty deck, player cards, cutter, played, nextplayer, winner, gameOver
    this._shuffle();
  };
  _cancel = async () => {};
  _determineWinner = async () => {};
  iconRenderer(name) {
    switch (name) {
      case "Spade":
        return <span>&#9824;</span>;
      case "Flower":
        return <span>&#9827;</span>;
      case "Heart":
        return <span>&#9829;</span>;
      case "Diamond":
        return <span>&#9830;</span>;
      default:
        return <span></span>;
    }
  }

  render() {
    let playerOneCards =
      this.state.playerOne &&
      this.state.playerOne.cards.map((value, key) => (
        <div
          onClick={() => this._playNext(this.state.playerOne, value)}
          className="card"
        >
          <span>{value.text}</span>
          {this.iconRenderer(value.type)}
        </div>
      ));

    let playerTwoCards =
      this.state.playerTwo &&
      this.state.playerTwo.cards.map((value, key) => (
        <span
          onClick={() => this._playNext(this.state.playerTwo, value)}
          className="card"
        >
          <span>{value.text}</span>
          {this.iconRenderer(value.type)}
        </span>
      ));

    let played =
      this.state.played &&
      this.state.played.map((value, key) => (
        <span className="card">
          <span>{value.text}</span>
          {this.iconRenderer(value.type)}
        </span>
      ));

    return (
      <div className="App">
        <div className="nextPlayer">{this.state.nextPlayer}</div>
        <h3>Player One</h3>
        {playerOneCards}
        <hr />
        <div className="played">{played}</div>
        <hr />
        <h3>Player Two</h3>
        {playerTwoCards}
        <hr />
        <h3>Deck</h3>
        <span className="card">{this.state.deck.length}</span>
        <hr />
        <h3>Cutter</h3>
        <div className="card">
          <span>{this.state.cutter.text}</span>
          {this.iconRenderer(this.state.cutter.type)}
        </div>
      </div>
    );
  }
}

class Player extends React.Component {}
class Deck extends React.Component {}
class Played extends React.Component {}

export default App;
