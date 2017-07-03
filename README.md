# Instagram Scraper

Basic scraper for Instagram user profile

## Installation
```
yarn add instagram-scraper
```

## How to use it

### Get user data

```
const instagramScraper = require('instagram-scraper')

instagramScraper.getUserData('teddysphotos').then(userData => {
  console.log('User data: ', userData)
})

```

### Get user posts

```
const instagramScraper = require('instagram-scraper')

instagramScraper.getUserPosts('teddysphotos').then(posts => {
  console.log('Posts: ', posts)
})

```

### Get post comments

```
const instagramScraper = require('instagram-scraper')

instagramScraper.getPostComments('BWD4NjklGAt').then(comments => {
  console.log('Post comments: ', comments)
})

```
