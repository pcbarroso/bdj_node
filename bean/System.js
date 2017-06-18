function System(code,name) {
    this.code = code;
    this.name = name;
     
    System.prototype.setCode = function setCode(code) {
       this.code = code;
    }
    
    System.prototype.setName = function setName(name) {
       this.name = name;
    }
} 

module.exports = System;