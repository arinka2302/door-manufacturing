const express = require("express");
const router = express.Router();

const { sequelize, bcrypt, Op, Staff, Record, Course } = require("../models");

router.get("/", async (req, res) => {
  res.render("index", { user: req.session.user });
});

router.get("/login", async (req, res) => {
  if (!req.session.user) {
    res.render("login");
  } else {
    res.redirect("/profile");
  }
});

router.get("/register", async (req, res) => {
  if (!req.session.user) {
    res.render("register");
  } else {
    res.redirect("/profile");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const findStaff = await Staff.findOne({ where: { email: email } });
  if (!findStaff) {
    return res.status(400).json({ message: "Пользователь не найден" });
  }
  const isValidPassword = await bcrypt.compare(password, findStaff.password);
  if (isValidPassword) {
    let sessionData = {
      id: findStaff.id,
      firstName: findStaff.firstName,
      lastName: findStaff.lastName,
      middleName: findStaff.middleName,
      username: findStaff.username,
      email: findStaff.email,
      role: findStaff.role,
    };
    req.session.user = sessionData;
    res.redirect("/profile");
  } else {
    res.status(400).json({ message: "Неверный пароль" });
  }
});

router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  if (name && username && email && password) {
    const fio = name.trim().split(/\s+/);
    const newStaff = await Staff.create({
      firstName: fio[1],
      lastName: fio[0],
      middleName: fio[2],
      username: username,
      email: email,
      password: password,
      role: 'user',
    });
    let sessionData = {
      id: newStaff.id,
      firstName: newStaff.firstName,
      lastName: newStaff.lastName,
      middleName: newStaff.middleName,
      username: newStaff.username,
      email: newStaff.email,
      role: "user",
    };
    req.session.user = sessionData;
    res.redirect("/profile");
  } else {
    res.json({ error: "Ошибка регистрации" });
  }
});

router.get("/courses", async (req, res) => {
  let courseAll;

  if (req.session.user) {
    courseAll = await Course.findAll({
      include: [
        {
          model: Record,
          where: { staff_id: req.session.user.id },
          required: false,
        },
      ],
    });
  } else {
    courseAll = await Course.findAll();
  }

  const courseFree = [];
  const courseBuy = [];

  courseAll.forEach((course) => {
    const courseData = {
      id: course.id,
      name: course.name,
      description: course.description,
      price: course.price,
      isSub: course.Records && course.Records.length > 0,
    };

    if (course.price > 0) {
      courseBuy.push(courseData);
    } else {
      courseFree.push(courseData);
    }
  });

  res.render("courses", { courseFree, courseBuy, user: req.session.user });
});

router.get("/courses/search", async (req, res) => {
  const { query } = req.query;
  if (req.session.user) {
    const courses = await Course.findAll({
      where: { name: { [Op.iLike]: `%${query.toLowerCase()}%` } },
      include: [
        {
          model: Record,
          where: { staff_id: req.session.user.id },
          required: false,
        },
      ],
    });
    res.render("search", { query: query, courses });
  } else {
    const courses = await Course.findAll({
      where: { name: { [Op.iLike]: `%${query.toLowerCase()}%` } },
    });
    res.render("search", { query: query, courses });
  }
});

module.exports = router;
