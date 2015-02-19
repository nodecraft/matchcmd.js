var cmd = require('./matchcmd.js');

cmd.use('resize :width :height?', function(command){
	console.log('Resize to %spx WIDTH %spx HEIGHT', command.args.width, command.args.height || command.args.width);
});

cmd.fail(function(input){
	return console.log('Command failed! Command: %s', input);
});

cmd.send('resize 200 500');
cmd.send('RESIZE 100');