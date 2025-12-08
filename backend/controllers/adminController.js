const { User, Entry, Comment } = require('../models');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['username', 'ASC']],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await Comment.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ['username', 'avatarColor'],
        }
      ]
    });

    res.json({
      comments: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error('Error while getting all comments:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Brak ID użytkownika' });

    if (req.user && req.user.id.toString() === id.toString()) {
      return res.status(403).json({
        error: 'Nie możesz zablokować samego siebie'
      });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Użytkownik nie istnieje' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `Użytkownik został ${user.isBlocked ? 'zablokowany' : 'odblokowany'}`,
      isBlocked: user.isBlocked
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findOne({
      where: { id: req.params.id },
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

exports.deleteComment = async (req, res) => {  
  try {
    const { entryId, commentId } = req.params;
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

    await comment.destroy();

    res.json({ success: true, message: "Komentarz usunięty." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: err.message });
  }
};