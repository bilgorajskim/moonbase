const Log = require('loglevel');

if (process.env.NODE_ENV === 'production' && ! localStorage.getItem('debug'))
{
    Log.setLevel('warn');
}
else
{
    Log.setLevel('debug');
}

module.exports = Log;