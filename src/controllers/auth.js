const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const config = require('../config');
const db = require('../models/index');
const validateAll = require('../utils/form');

exports.register = async (req, res) => {
  const rules = {
    name: 'required',
    email: 'required|email',
    password: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  const trx = await db.sequelize.transaction();

  try {
    const existing = await db.User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (existing) {
      return res.json({
        success: false,
        message: 'Email sudah terdaftar.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    const userID = nanoid();
    const data = await db.User.create(
      {
        id: userID,
        email: req.body.email,
        name: req.body.name,
        password: hashed,
      },
      { transaction: trx }
    );

    const payload = {
      identity: data.id,
      user_claims: {
        id: data.id,
        email: data.email,
        name: data.name,
      },
    };

    const jwtOptions = {
      issuer: config.JWT_ISSUER,
      subject: 'access',
      algorithm: config.JWT_ALGORITHM,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, jwtOptions);

    await trx.commit();

    return res.json({
      type: 'Bearer',
      token: token,
      data: data,
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);

    return res.json({
      success: false,
      message: 'Terjadi kesalahan.',
    });
  }
};
