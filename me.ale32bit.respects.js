/*
    Respects Bot Plugin for SwitchChat Bot

    Copyright (c) 2019 Alessandro "Ale32bit"
*/

const { BotPlugin, utils } = require("switchchat");
const fs = require("fs");
const path = require("path");
class Respects extends BotPlugin {
    constructor(client){
        super(client, "me.ale32bit.respects", {

        });

        if(!fs.existsSync(this.configPath)){
            fs.mkdirSync(this.configPath);
        }

        if(!fs.existsSync(path.resolve(this.configPath, "players.json"))){
            fs.writeFileSync(path.resolve(this.configPath, "players.json"), "{}");
        }

        this.respects = require(path.resolve(this.configPath, "players.json"));

        function cc(m) {
            return m.replace("&", "§")
        }

        this.lastDeath = null;
        this.alreadyPaid = [];
        this.triggerRegex = /^[f]$/i;

        client.on("death", (death) => {
            console.log(death.message);
            this.lastDeath = death.player;
            this.alreadyPaid = [];
        });

        client.on("chat", (message) => {
            if (this.triggerRegex.test(message)) {
                if (this.lastDeath) {
                    if (utils.inArray(this.alreadyPaid, message.player.username)) {
                        message.player.tell(cc(`&cYou already paid respects!`), "Respects", "format");
                        return
                    }
                    if (this.lastDeath.name === message.player.name) {
                        message.player.tell(cc(`&cYou cannot respect yourself >:C`), "Respects", "format");
                        return
                    }
                    this.alreadyPaid.push(message.player.username);
                    if (!this.respects[this.lastDeath.uuid]) this.respects[this.lastDeath.uuid] = 0;
                    this.respects[this.lastDeath.uuid]++;
                    this.lastDeath.tell(cc(`&a${message.player} &6paid you respects!`), "Respects", "format");
                    message.player.tell(cc(`&6You paid &a${this.lastDeath} &6respects!`), "Respects", "format");
                }
            }
        });

        this.addCommand("respects", command => {
            if (!this.respects[command.player.uuid]) this.respects[command.player.uuid] = 0;
            command.player.tell(cc(`&6You have &7${this.respects[command.player.uuid]} &6respects!`), "Respects", "format");
        });
    }
}

module.exports = Respects;
