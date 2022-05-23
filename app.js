function getRandomValue(min, max) {
  return (attackValue = Math.floor(Math.random() * (max - min)) + min);
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      playerWin: 0,
      monsterWin: 0,
      winner: null,
      logMessages: [],
    };
  },
  watch: {
    playerHealth(value) {
      //Player lost
      if (value <= 0) {
        this.monsterWin++;
        this.winner = "monster";
      }
      //Draw
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      }
    },
    monsterHealth(value) {
      //Draw
      if (value <= 0 && this.playereHealth <= 0) {
        this.winner = "draw";
      }
      //Monster lost
      if (value <= 0) {
        this.playerWin++;
        this.winner = "player";
      }
    },
  },
  computed: {
    playerBarStyles() {
      //if player health falls below zero.
      if (this.playerHealth <= 0) return { width: 0 + "%" };
      //SETTING HEALTH BAR TO PLAYER HEALTH
      if (this.playerHealth > 0) return { width: this.playerHealth + "%" };
    },
    monsterBarStyles() {
      if (this.monsterHealth <= 0) return { width: 0 + "%" };
      if (this.monsterHealth > 0) return { width: this.monsterHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    mayUseHeal() {
      return this.playerHealth === 100;
    },
    battleLog() {},
  },
  methods: {
    //attacking the monster
    attackMonster() {
      //adding to the round total
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      //monster attacking player
      this.attackPlayer();
    },
    //attacking player
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },

    //special attack for player
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.addLogMessage("monster", "attack", attackValue);
      this.monsterHealth -= attackValue;
      this.attackPlayer();
    },

    //heal ability
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      console.log(healValue);
      if (this.playerHealth + healValue > 100) this.playerHealth = 100;
      else {
        return (this.playerHealth += healValue);
      }
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    restartGame() {
      if (this.monsterWin === 3 || this.playerHealth === 3) {
        this.monsterWin = 0;
        this.playerWin = 0;
      }
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
    },
    surrender() {
      this.monsterWin++;
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});
app.mount("#game");
