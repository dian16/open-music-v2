const ClientError = require('../../exceptions/ClientError')

class MusicHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postSongHandler = this.postSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
  }

  async postSongHandler (request, h) {
    try {
      this._validator.validateSongPayload(request.payload)
      const { title = 'untitled', year, performer, genre, duration } = request.payload

      const songId = await this._service.addSong({ title, year, performer, genre, duration })

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getSongsHandler () {
    const songs = await this._service.getSongs()
    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getSongByIdHandler (request, h) {
    try {
      const { songId } = request.params

      const song = await this._service.getSongById(songId)
      return {
        status: 'success',
        data: {
          song
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async putSongByIdHandler (request, h) {
    try {
      this._validator.validateSongPayload(request.payload)

      const { songId } = request.params
      const { title, year, performer, genre, duration } = request.payload
      await this._service.editSongById(songId, { title, year: +year, performer, genre, duration: +duration })
      // this._service.editSongById(songId, request.payload)
      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deleteSongByIdHandler (request, h) {
    try {
      const { songId } = request.params
      await this._service.deleteSongById(songId)
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = MusicHandler
