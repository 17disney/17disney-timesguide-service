const Controller = require('egg').Controller

class TimesguideController extends Controller {
  async list() {
    const { ctx } = this
    const { local = 'shanghai' } = ctx.query
    const list = await ctx.model.Timesguide.findAll({
      where: {
        local
      },
      order: [['startDate', 'ASC']]
    })
    ctx.body = list
  }

  async id() {
    const { ctx } = this
    const { id } = ctx.params
    let data = await ctx.model.Timesguide.findOne({
      where: {
        id
      },
      include: [
        {
          model: ctx.model.User,
          attributes: ['id', 'avatar', 'name']
        }
      ]
    })

    const have = await ctx.model.Exchange.count({
      where: {
        tid: id,
        targetTid: null
      }
    })

    const exchange = await ctx.model.Exchange.count({
      where: {
        tid: id
      }
    })

    data.have = have
    data.exchange = exchange

    this.ctx.body = data
  }

  async create() {}

  async uploadId() {
    const { ctx } = this
    const data = ctx.request.body
    const { id, author, startDate, endDate, local, picName, rate } = data
    const res = await ctx.model.Timesguide.update(
      {
        author,
        startDate,
        endDate,
        local,
        picName,
        rate
      },
      { where: { id } }
    )
    ctx.body = { id }
  }

  async starteds() {
    const { ctx } = this
    const { id } = ctx.params
    const { status = 1 } = ctx.query
    const data = await ctx.model.Started.findAll({
      where: {
        status,
        tid: id
      },
      include: [{
        model: ctx.model.User,
        attributes: ['id', 'avatar', 'name']
      }]
    })
    ctx.body = data
  }

  async userList() {
    this.ctx.body = 'hi, egg'
  }

  async userUploadTid() {
    this.ctx.body = 'hi, egg'
  }
}

module.exports = TimesguideController
