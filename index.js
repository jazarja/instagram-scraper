const request = require('request-promise');
const _ = require('lodash')

const getUserData = username => {
  return request({
      url: `https://www.instagram.com/${username}/?__a=1`
  }).then(JSON.parse)
}

const getUserPostsRecursive = (userId, after) => {
  const endpoint = `https://www.instagram.com/graphql/query/?query_id=17862015703145017&id=${userId}&first=500&after=${after}`
  return request({
      url: endpoint,
      timeout: 10000
  }).then(response => {
    const parsedResponse = JSON.parse(response)
    const postData = _.get(parsedResponse, 'data.user.edge_owner_to_timeline_media') || {}
    const edges = postData.edges || []
    const posts = _.map(edges, 'node')
    const hasNext = _.get(postData, 'page_info.has_next_page')
    if (hasNext) {
      return getUserPostsRecursive(userId, postData.page_info.end_cursor).delay(6000).then(nextPosts => {
        return posts.concat(nextPosts)
      })
    }
    return posts
  })
}

const getUserPosts = username => {
  return getUserData(username)
    .then(({user}) => {
      const posts = user.media.nodes
      if (user.media.page_info.has_next_page)
        return getUserPostsRecursive(user.id, user.media.page_info.end_cursor).then(data => {
          return posts.concat(data);
        })
      else
        return posts
    })
}

const getPostCommentsRecursive = (postCode, after) => {
  const endpoint = `https://www.instagram.com/graphql/query/?query_id=17852405266163336&shortcode=${postCode}&first=1000&after=${after}`
    return request({
      url: endpoint,
      timeout: 10000
    }).then(response => {
      const parsedResponse = JSON.parse(response)
      const commentData = _.get(parsedResponse, 'data.shortcode_media.edge_media_to_comment') || {}
      const edges = commentData.edges || []
      const comments = _.map(edges, 'node')
      const hasNext = _.get(commentData, 'page_info.has_next_page')
      if (hasNext) {
        return getPostCommentsRecursive(postCode, commentData.page_info.end_cursor).delay(6000).then(nextComments => {
          return comments.concat(nextComments)
        })
      }
      return comments
    })
}

const getPostComments = postCode => {
  return request({
      url: `https://www.instagram.com/p/${postCode}/?__a=1`
  }).then(response => {
    const parsedResponse = JSON.parse(response)
    const commentsInfo = _.get(parsedResponse, 'graphql.shortcode_media.edge_media_to_comment')
    const commentEdges = commentsInfo.edges || []
    const comments = _.map(commentEdges, 'node')

    if(_.get(commentsInfo, 'page_info.has_next_page')) {
      return getPostCommentsRecursive(postCode, commentsInfo.page_info.end_cursor).then(nextComments => {
        return comments.concat(nextComments)
      })
    }
    return comments
  })
}

module.exports = {
  getUserData,
  getUserPosts,
  getPostComments
}
