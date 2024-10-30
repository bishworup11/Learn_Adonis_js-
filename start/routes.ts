/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { Exception } from '@adonisjs/core/exceptions'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import fs from 'node:fs/promises'

router.on('/').render('pages/home').as('home')

// Persistent posts array for testing (normally, you'd use a database)

router.get('login', (ctx) => {
  const csrfToken = ctx.request.csrfToken

  // ctx.response.send({ csrfToken })
  ctx.response.status(200).send(csrfToken)
})

// all posts get

router.get('get-posts', (ctx) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World',
    },
    {
      id: 2,
      title: 'Hello World 2',
    },
  ]
  ctx.response.status(200).send(posts)
})

// create post
router.post('create-posts', (ctx) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World',
    },
    {
      id: 2,
      title: 'Hello World 2',
    },
  ]

  const newPostTitle = ctx.request.input('title')

  const newPost = {
    id: 3,
    title: newPostTitle,
  }

  posts.push(newPost)

  ctx.response.status(201).send({
    message: 'Create post successfully',
    posts: posts,
    newPost: newPost,
  })
})

// update post
router.post('update-posts', (ctx) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World',
    },
    {
      id: 2,
      title: 'Hello World 2',
    },
    {
      id: 3,
      title: 'Post 3 2',
    },
  ]

  const postId = ctx.request.input('id')
  const newPostTitle = ctx.request.input('title')

  // select post from database
  const post = posts.find((post) => post.id === postId)

  // if post not found, return error | validation
  if (!post) {
    return ctx.response.status(404).send({
      message: 'Post not found',
    })
  }

  post.title = newPostTitle
  // update post in database
  posts.splice(posts.indexOf(post), 1, post)

  ctx.response.status(201).send({
    message: 'Update post successfully',
    posts: posts,
    post: post,
  })
})

// delete post
router.delete('delete-posts', (ctx) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World',
    },
    {
      id: 2,
      title: 'Hello World 2',
    },
    {
      id: 3,
      title: 'Post 3 2',
    },
  ]

  const postId = ctx.request.input('id')

  // select post from database
  const post = posts.find((post) => post.id === postId)

  // if post not found, return error | validation
  if (!post) {
    return ctx.response.status(404).send({
      message: 'Post not found',
    })
  }

  // delete post from database
  posts.splice(posts.indexOf(post), 1)

  ctx.response.status(201).send({
    message: 'Delete post successfully',
    post: post,
  })
})
