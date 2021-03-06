const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class MusicService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong ({ title, year, performer, genre, duration }) {
    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const query = {
      text: 'INSERT into musics VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan')
    }
    return result.rows[0].id
  }

  async getSongs () {
    const result = await this._pool.query('SELECT id, title, performer FROM musics')
    return result.rows
  }

  async getSongById (songId) {
    const query = {
      text: 'SELECT * FROM musics WHERE id = $1',
      values: [songId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    return result.rows[0]
  }

  async editSongById (songId, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE musics SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "updatedAt" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbaharui lagu. Id tidak ditemukan')
    }
  }

  async deleteSongById (songId) {
    const query = {
      text: 'DELETE FROM musics WHERE id = $1 RETURNING id',
      values: [songId]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = MusicService
