'use strict';
module.exports = function(sequelize, DataTypes) {
var Article = sequelize.define("Article",{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    category_id: {type:DataTypes.STRING(36),allowNull:true},
    title:{type:DataTypes.STRING(200),allowNull:false},
    content:{type:DataTypes.TEXT,allowNull:true},
    imgurl:{type:DataTypes.STRING(100)},
    remark:{type:DataTypes.STRING(200)},
    
    creator_id:{type:DataTypes.INTEGER,allowNull:true},
   
});

return Article;
}