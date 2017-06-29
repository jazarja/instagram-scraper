# Instagram Scraper

Basic scraper for Instagram user profile

## Installation
```
yarn add instagram-scraper
```

## How to use it
```
const instagramScraper = require('instagram-scraper')

instagramScraper.getUserData('teddysphotos').then(userData => {
  console.log('User data: ', userData)
})

```
