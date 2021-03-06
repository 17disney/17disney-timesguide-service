const moment = require('moment')
const { TIMESGUIDE_TYPE } = require('../utils/const')

// 乐园时间表
// 乐园指南：乐园指南、小镇指南、其它指南
// 乐园门票：乐园门票、兑换券

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const Timesguide = app.model.define(
    'timesguides',
    {
      startDate: DATE,
      endDate: DATE,
      local: STRING(20),
      rate: {
        type: INTEGER,
        defaultValue: 0
      },
      picUrl: STRING(255),
      have: {
        type: INTEGER,
        defaultValue: 0
      },
      exchange: {
        type: INTEGER,
        defaultValue: 0
      },
      contribute: {
        type: INTEGER,
        defaultValue: 0
      },
      type: {
        type: INTEGER,
        defaultValue: TIMESGUIDE_TYPE.TIMESGUIDE
      },
      started: {
        type: INTEGER,
        defaultValue: 0
      }
    },
    {
      indexes: [
        {
          fields: ['startDate']
        },
        {
          fields: ['local']
        },
        {
          fields: ['created_at']
        }
      ],
      getterMethods: {
        dateRang() {
          const startYearDate = moment(this.startDate).format('YYYY.MM.DD')
          const startDate = moment(this.endDate).format('MM.DD')
          const endDate = moment(this.endDate).format('MM.DD')
          if (startDate === endDate) {
            return startYearDate
          } else {
            return startDate + '-' + endDate
          }
        },
        price() {
          const days = moment().diff(moment(this.startDate), 'days')
          if (days <= 7) {
            return 0
          }
          return 20 + Math.ceil(days / 90) * 10
        }
      }
    }
  )

  Timesguide.associate = function() {
    app.model.Timesguide.hasMany(app.model.Exchange, {
      foreignKey: 'tid'
    })
    app.model.Timesguide.hasMany(app.model.Contribute, {
      foreignKey: 'tid'
    })
    app.model.Timesguide.hasMany(app.model.TimesguideChildren, {
      foreignKey: 'tid'
    })
    app.model.Timesguide.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }

  return Timesguide
}
