var ghpages = require('gh-pages');

ghpages.publish(
    'public',
    {
        branch: 'gh-pages'
    },
    () => {
        console.log('Deploy Complete!')
    }
)
