Installation
=============
    npm install matchcmd
    
What does it do?
=============
matchcmd is a parser for routing strings to commands. Commands can be statically typed or used with STDIN for a script. Each command assumes all arguments are matched to any character other than spaces, tabs, or empty characters.

Example
=============
```javascript
    var cmd = require('./matchcmd.js');

    cmd.use('resize :width :height?', function(command){
        console.log('Resize to %spx WIDTH %spx HEIGHT', command.args.width, command.args.height || command.args.width);
    });

    cmd.use(['rs', 'restart'], function(command){
        console.log('Restarted?');
    });
    cmd.fail(function(input){
        return console.log('Command failed! Command: %s', input);
    });

    cmd.send('resize 200 500');
    cmd.send('RESIZE 100');
    cmd.send('rs');
    cmd.send('restart');
    cmd.send('fake command');
```


Results:
```
    Resize to 200px WIDTH 500px HEIGHT
    Resize to 100px WIDTH 100px HEIGHT
    Restarted?
    Restarted?
    Command failed! Command: fake command
```
