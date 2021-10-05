exports.up = pgm => {
  pgm.createTable('musics', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(300)',
      notNull: true
    },
    year: {
      type: 'INT',
      notNull: true
    },
    performer: {
      type: 'TEXT',
      notNull: true
    },
    genre: {
      type: 'TEXT',
      notNull: true
    },
    duration: {
      type: 'INT',
      notNull: true
    },
    insertedAt: {
      type: 'TEXT',
      notNull: true
    },
    updatedAt: {
      type: 'TEXT',
      notNull: true
    }

  })
}

exports.down = pgm => {
  pgm.dropTable('musics')
}
