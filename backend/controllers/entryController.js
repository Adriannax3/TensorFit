const { Entry, User, Comment, Like } = require('../models');
const { literal } = require('sequelize');


exports.createEntry = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Brak wymaganych pól (title)" });
    }

    const image = req.file ? req.file.buffer : null;

    const entry = await Entry.create({
      title,
      description,
      image,
      userId: req.user.id,
    });

    res.status(201).json(entry);

  } catch (err) {
    console.error('Error while creating entry:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMyEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const entries = await Entry.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM "Likes" AS "Like"
              WHERE "Like"."entryId" = "Entry"."id"
            )`),
            'likeCount'
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM "Comments" AS "Comment"
              WHERE "Comment"."entryId" = "Entry"."id"
            )`),
            'commentCount'
          ],
          [
            literal(`EXISTS (
              SELECT 1
              FROM "Likes" AS "Like"
              WHERE "Like"."entryId" = "Entry"."id"
                AND "Like"."userId" = ${userId}
            )`),
            'likedByMe'
          ]
        ]
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        }
      ]
    });

    res.json(entries);
  } catch (err) {
    console.error('Error while getting my entries:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getAllEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await Entry.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM "Likes" AS "Like"
              WHERE "Like"."entryId" = "Entry"."id"
            )`),
            'likeCount'
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM "Comments" AS "Comment"
              WHERE "Comment"."entryId" = "Entry"."id"
            )`),
            'commentCount'
          ],
          [
            literal(`EXISTS (
              SELECT 1
              FROM "Likes" AS "Like"
              WHERE "Like"."entryId" = "Entry"."id"
                AND "Like"."userId" = ${userId}
            )`),
            'likedByMe'
          ],
          [
            literal(`"Entry"."userId" = ${userId}`),
            'isMine'
          ]
        ]
      },
      include: [
        {
          model: User,
          attributes: ['username', 'avatarColor'],
        }
      ]
    });

    res.json({
      entries: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error('Error while getting all entries:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getEntryById = async (req, res) => {
  try {
    const entry = await Entry.findOne({
      where: { id: req.params.id },
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM "Likes" AS "Like"
              WHERE "Like"."entryId" = "Entry"."id"
            )`),
            'likeCount'
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM "Comments" AS "Comment"
              WHERE "Comment"."entryId" = "Entry"."id"
            )`),
            'commentCount'
          ]
        ]
      },
      include: [
        {
          model: User,
          attributes: ['username', 'avatarColor'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username', 'avatarColor'],
            }
          ]
        }
      ]
    });

    if (!entry) {
      return res.status(404).json({ error: 'Nie znaleziono wpisu' });
    }

    res.json(entry);
  } catch (err) {
    console.error('Error while getting entry by id:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const entry = await Entry.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Nie znaleziono wpisu' });
    }

    const { title, description } = req.body;

    if (title !== undefined) entry.title = title;
    if (description !== undefined) entry.description = description;

    if (req.file) {
      entry.image = req.file.buffer;
    }

    await entry.save();

    res.json(entry);
  } catch (err) {
    console.error('Error while updating entry:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEntry = async (req, res) => {
  console.log('delete entry');
  try {
    const entry = await Entry.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Nie znaleziono wpisu' });
    }

    await entry.destroy();

    res.json({ message: 'Wpis usunięty' });
  } catch (err) {
    console.error('Error while deleting entry:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const entryId = req.params.id;
    const userId = req.user.id;

    const entry = await Entry.findByPk(entryId);
    if (!entry) {
      return res.status(404).json({ error: 'Nie znaleziono wpisu' });
    }

    const existing = await Like.findOne({
      where: { userId, entryId }
    });

    let liked;
    if (existing) {
      await existing.destroy();
      liked = false;
    } else {
      await Like.create({ userId, entryId });
      liked = true;
    }

    const likeCount = await Like.count({ where: { entryId } });

    return res.json({ liked, likeCount });
  } catch (err) {
    console.error('Error while toggling like:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const entryId = req.params.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Treść komentarza jest wymagana' });
    }

    const entry = await Entry.findByPk(entryId);
    if (!entry) {
      return res.status(404).json({ error: 'Nie znaleziono wpisu' });
    }

    const comment = await Comment.create({
      content: content.trim(),
      userId: req.user.id,
      entryId: entry.id,
    });

    const fullComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    res.status(201).json(fullComment);
  } catch (err) {
    console.error('Error while creating comment:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {  
  try {
    const { entryId, commentId } = req.params;
    console.log("Deleting comment", { entryId, commentId });
    const userId = req.user.id;

    const comment = await Comment.findOne({
      where: { id: commentId, entryId },
      include: [
        {
          model: Entry,
          attributes: ["userId"]
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({ error: "Komentarz nie istnieje." });
    }

    const isAuthor = comment.userId === userId;
    const isEntryOwner = comment.Entry.userId === userId;

    if (!isAuthor && !isEntryOwner) {
      return res
        .status(403)
        .json({ error: "Nie masz uprawnień do usunięcia tego komentarza." });
    }

    await comment.destroy();

    res.json({ success: true, message: "Komentarz usunięty." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: err.message });
  }
};