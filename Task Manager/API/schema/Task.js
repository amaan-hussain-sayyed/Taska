let {sequelizeCon,Model,DataTypes,Op,QueryTypes,rawQuery}=require("../init/dbConfig");

class Task extends Model{}

Task.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    startDate:{
        type:DataTypes.DATE,
        allowNull:true
    },
    endDate:{
        type:DataTypes.DATE,
        allowNull:true
    },
    expectedStartDate:{
        type:DataTypes.DATE,
        allowNull:true   
    },
    expectedEndDate:{
        type:DataTypes.DATE,
        allowNull:true
    },
    assignTo:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    status:{
        type:DataTypes.TINYINT,
        allowNull:false,
        defaultValue:1
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:false
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    updatedBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
   
},{tableName:"task", modelName:"Task",sequelize:sequelizeCon});
Task.sync();
module.exports={Task , rawQuery,QueryTypes}
