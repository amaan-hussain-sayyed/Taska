let { Sequelize, Model, DataTypes, Op, QueryTypes } = require("sequelize");
let config = require("config");
let mysql = config.get("mysql")

let sequelizeCon = new Sequelize(mysql);

sequelizeCon.authenticate().then(() => { console.log("connected to DB"); }).catch((error) => {
    console.log("DB error", error);
})

module.exports = { sequelizeCon, Model, DataTypes, Op, QueryTypes };