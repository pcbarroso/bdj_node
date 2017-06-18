function Game(code,name,systems) {
    this.code = code;
    this.name = name;
    this.systems = systems;
    
    Game.prototype.setCode = function setCode(code) {
       this.code = code;
    }
    
    Game.prototype.setName = function setName(name) {
       this.name = name;
    }
} 

module.exports = Game;