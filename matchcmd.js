'use strict';
var _ = require('lodash');

var helpers = {
	parse: function(pattern){
		var parts = String(pattern).split(' '),
			cmd = [],
			regex = [];
		// get parts
		_.each(parts, function(part){
			var cmdPart = {
				variable: false,
				optional: false,
				value: part
			};
			if(part.slice(0, 1) === ':'){
				cmdPart.variable = true;
				cmdPart.value = cmdPart.value.slice(1);
				if(part.slice(-1) == '?'){
					cmdPart.optional = true;
					cmdPart.value = cmdPart.value.slice(0, -1);
				}
			}
			cmd.push(cmdPart);
		});

		// setup regex
		_.each(cmd , function(cmdPart){
			if(!cmdPart.variable){
				return regex.push(cmdPart.value)
			}
			return regex.push('([^\\s]{1,})' + (cmdPart.optional && '?' || ''));
		});

		return {
			cmd: cmd,
			pattern: '^' + regex.join('(?:\\s+)?') + '$'
		}
	},

	// store all commands
	commands: [],

	// commands failed callback
	emptyCommand: function(input){
		return console.log('Command faild: %s', input);
	}
}

module.exports = {
	use: function(pattern, callback){
		var cmd = helpers.parse(pattern);
		helpers.commands.push({
			pattern: new RegExp(cmd.pattern, 'i'),
			fn: callback,
			cmd: cmd
		});
	},
	fail: function(callback){
		helpers.emptyCommand = callback;
	},
	send: function(input){
		var result = false;
		_.each(helpers.commands, function(command){
			if(result !== false){ return; }
			var regex = command.pattern.exec(input);
			//console.log('regex test', command.pattern, input);
			if(regex == null){
				return helpers.emptyCommand(input);
			}
			command.parts = regex;
			result = command;
		});

		if(result){
			var args = {};
			var key = 1;
			_.each(result.cmd.cmd, function(cmdPart){
				if(cmdPart.variable){
					args[cmdPart.value] = result.parts[key];
					key++;
				}
			});
			return result.fn({
				args: args,
				parts: result.parts,
				raw: input
			});
		}
	}
}