const express = require("express");
const session = require("express-session");
const hbs = require("hbs");

const {
  sequelize,
  Staff,
  Door,
  OrderDoor,
  Order,
  Record,
  Course,
  Supplier,
  Material,
} = require("./models");
const publicRouter = require("./routes/public.router");
const authRouter = require("./routes/auth.router");

const OrderStatus = ["paid", "production", "received", "cancelled"];

const app = express();

app.use(
  session({
    name: "session",
    secret: "qOmZIZwBY7fpK+Elscn8VozBdVgqBEWCYmPDXuMMOvU=",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 48 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", publicRouter);
app.use("/", authRouter);
app.set("view engine", "hbs");

hbs.registerHelper("ifEquals", function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

const dev = process.env.NODE_ENV === "dev";

(async () => {
  await sequelize.authenticate();

  if (dev) {
    await sequelize.sync({ force: true });
    const course = await Course.create({
      name: "Современные технологии производства дверей",
      description:
        "В этом курсе сотрудники изучат новейшие методы и технологии, используемые в производстве дверей. Обсуждаются автоматизация процессов, использование роботизированных систем и внедрение инновационных материалов",
      duration: 144,
    });
    const course2 = await Course.create({
      name: "Эффективное управление качеством на производстве дверей",
      description:
        "Курс направлен на обучение сотрудников принципам управления качеством, включая методы контроля и повышения стандартов. Участники познакомятся с основными инструментами, которые помогут минимизировать брак и повысить общую эффективность процесса",
      duration: 144,
    });
    const course3 = await Course.create({
      name: "Экологические нормы и стандарты в производстве дверей",
      description:
        " Курс охватывает актуальные экологические требования и стандарты, которые должны соблюдать производственные компании",
      duration: 144,
    });
    const course4 = await Course.create({
      name: "Дизайн и эргономика дверей",
      description:
        "В этом курсе акцент сделан на эстетические и функциональные аспекты дверного дизайна. Сотрудники изучат основы эргономики, применимые к производству дверей, и научатся создавать решения, которые соответствуют современным трендам и потребностям пользователей",
      duration: 144,
    });
    const course5 = await Course.create({
      name: "Инновационные материалы в производстве дверей",
      description:
        "Этот курс направлен на изучение современных материалов для производства дверей, таких как композиты, 3D-печать и экологические покрытия. Участники узнают, как выбрать подходящие материалы для различных типов дверей, а также о их воздействии на качество и долговечность продукции",
      duration: 144,
      price: 12499.0,
    });
    const course6 = await Course.create({
      name: "Современные CAD-системы для проектирования дверей",
      description:
        "Курс посвящен обучению работе с программами компьютерного дизайна (CAD), специально разработанными для проектирования дверей. Сотрудники освоят создание 2D и 3D моделей",
      duration: 250,
      price: 18999.0,
    });
    const course7 = await Course.create({
      name: "Управление персоналом на производстве дверей",
      description:
        "Этот курс предлагает знания и навыки, необходимые для управления командами на производстве. Участники изучат методы мотивации, организацию рабочего процесса и управление конфликтами, что поможет создать сплоченный коллектив",
      duration: 100,
      price: 19999.0,
    });
    const course8 = await Course.create({
      name: "Технологии маркетинга для производства дверей",
      description:
        "Курс ориентирован на обучение основам маркетинга и продаж в сфере производства дверей. Участники узнают о трендах рынка, особенностях продвижения продукции и методах взаимодействия с клиентами, что позволит повысить конкурентоспособность компании",
      duration: 130,
      price: 11499.0,
    });

    const staff = await Staff.create({
      firstName: "Герман",
      lastName: "Демидов",
      middleName: "Михайлович",
      username: "german",
      email: "german@mail.ru",
      password: "1",
      role: "admin",
    });
    const staff2 = await Staff.create({
      firstName: "Денис",
      lastName: "Зайцев",
      middleName: "Дамирович",
      username: "zaycev",
      email: "zaycev@mail.ru",
      password: "2",
      role: "user",
    });

    await Record.create({
      staff_id: staff2.id,
      course_id: course2.id,
      created_at: Date.now(),
    });

    const supplier = await Supplier.create({
      name: "HYD",
      address: "г.Оренбург, ул.Восточная 49",
      phone: "+79129038419",
      created_at: Date.now(),
    });
    const supplier2 = await Supplier.create({
      name: "Gybrad",
      address: "г.Санкт-Петербург, ул.Мебельная 1Д",
      phone: "+79129038419",
      created_at: Date.now(),
    });

    const material = await Material.create({
      name: "Древесина",
      supplier_id: supplier.id,
      quantity: 20000,
      unit_price: 40000.0,
      unit: "м³",
    });
    const material2 = await Material.create({
      name: "ПВХ",
      supplier_id: supplier.id,
      quantity: 50000,
      unit_price: 45000.0,
      unit: "м³",
    });
    const material3 = await Material.create({
      name: "МДФ",
      supplier_id: supplier2.id,
      quantity: 30000,
      unit_price: 25000.0,
      unit: "м³",
    });
    const material4 = await Material.create({
      name: "ДСП",
      supplier_id: supplier2.id,
      quantity: 22000,
      unit_price: 20000.0,
      unit: "м³",
    });

    const door = await Door.create({
      name: "Дверь межкомнатная Остиум U8 ДГ",
      description:
        "Простота линий, идеальные пропорции - отличительные черты новой коллекции Union. Ненавязчивая классика, в этой коллекции нет ничего лишнего",
      material_id: material.id,
      width: 800.0,
      height: 20000.0,
      thickness: 38.0,
      price: 8150.0,
      color: "Серый",
      quantity: 0,
      guarantee: 5,
    });
    const door2 = await Door.create({
      name: "Дверь межкомнатная Остиум Р 20 ДГ",
      description:
        "Модели этой коллекции стали достойным ответом набирающему популярность стилю неоклассики в декорировании помещений",
      material_id: material.id,
      width: 800.0,
      height: 20000.0,
      thickness: 40.0,
      price: 16050.0,
      color: "Бежевый",
      quantity: 0,
      guarantee: 5,
    });
    const door3 = await Door.create({
      name: "Дверь межкомнатная Carda TOCKAHA",
      description:
        "Простота линий, идеальные пропорции - отличительные черты новой коллекции Union. Ненавязчивая классика, в этой коллекции нет ничего лишнего",
      material_id: material.id,
      width: 800.0,
      height: 18000.0,
      thickness: 36.0,
      price: 8250.0,
      color: "Графитный",
      quantity: 0,
      guarantee: 5,
    });
    const door4 = await Door.create({
      name: "Дверь межкомнатная Profil Doors 1LK",
      description:
        "Серия LK - это коллекция каркасных дверей в глянцевом покрытии, разработанном в Германии на основе новейших разработок",
      material_id: material2.id,
      width: 900.0,
      height: 20000.0,
      thickness: 36.0,
      price: 40250.0,
      color: "Белый люкс",
      quantity: 1,
      guarantee: 5,
    });
    const door5 = await Door.create({
      name: "Дверь межкомнатная Profil Doors 42ZN",
      description:
        "Серия ZN - это коллекция каркасных дверей в покрытии полипропилен с новейшей эксклюзивной структурой, идеально  натурального дерева",
      material_id: material3.id,
      width: 900.0,
      height: 20000.0,
      thickness: 36.0,
      price: 40250.0,
      color: "Коричневый",
      quantity: 1,
      guarantee: 5,
    });
    const door6 = await Door.create({
      name: "Дверь межкомнатная Aurum Pd 5",
      description:
        "Основа двери - МДФ ”Swiss krono” (Швейцария), толщиной 6мм. Сотовое наполнение",
      material_id: material4.id,
      width: 600.0,
      height: 18000.0,
      thickness: 36.0,
      price: 18711.0,
      color: "Серый",
      quantity: 1,
      guarantee: 5,
    });

    const order = await Order.create({
      staff_id: staff2.id,
      status: OrderStatus[0],
      created_at: Date.now(),
    });
    const order2 = await Order.create({
      staff_id: staff2.id,
      status: OrderStatus[1],
      comment: "Тестовый комментарий",
      created_at: Date.now(),
    });
    const order3 = await Order.create({
      staff_id: staff2.id,
      status: OrderStatus[3],
      created_at: Date.now(),
    });

    await OrderDoor.create({
      order_id: order.id,
      door_id: door.id,
      quantity: 1,
    });
    await OrderDoor.create({
      order_id: order2.id,
      door_id: door2.id,
      quantity: 1,
    });
    await OrderDoor.create({
      order_id: order3.id,
      door_id: door3.id,
      quantity: 1,
    });
  } else {
    await sequelize.sync();
  }
})();

app.listen(80);
