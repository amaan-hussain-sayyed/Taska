const { types } = require("joi")
let {sequelizeCon,Model,DataTypes,Op}=require("../init/dbConfig")

class TaskComment extends Model{}

TaskComment.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    comments:{
        type:DataTypes.STRING(800),
        allowNull:false
    },
    taskID:{
        type:DataTypes.INTEGER(),
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{tableName:"taskComment",modelName:"TaskComment",sequelize:sequelizeCon})
// TaskComment.sync()

module.exports={TaskComment}
