module.exports = {
    apps: [
      {
        name: 'next',
            script: './node_modules/next/dist/bin/next',
            args: 'start -p ' + (process.env.PORT || 3000), 
            instances: 4,
            exec_mode: 'cluster',
            watch: false,
            autorestart: true,
      },
    ],
  };

