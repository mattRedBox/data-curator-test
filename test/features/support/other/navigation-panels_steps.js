import { Then } from 'cucumber'
import { waitForVisibleIdFromLabel } from '../page-objects/selectors.js'
import { expect } from 'chai'
import _ from 'lodash'
import { sendOpenUrlCall } from '../page-objects/helpers.js'

Then(/^the "([\w ]+?)" panel should be displayed/, { timeout: -1 }, async function (panelName) {
  await waitForVisibleIdFromLabel(this.app, '#sidenav', panelName, this.pageTimeout)
})

Then(/^the major contributor: "(.+?)"(?:| with attribution statements) and logo: "(.+?)" should be displayed$/, async function (contributorText, logo) {
  const aboutProperties = this.app.client.waitForVisible('#aboutProperties', 1000)
  const result = await aboutProperties.getText('.list-group')
  let found = _.find(result, function (next) {
    return _.includes(next, contributorText)
  })
  console.log(`first found is ${found}`)
  expect(_.isEmpty(found)).to.equal(false)
  const logoResult = await aboutProperties.getAttribute('img', 'src')
  console.log(`logo is ${logo}`)
  const re = new RegExp(`static/img/${logo}.png`)
  found = _.find(logoResult, function (next) {
    console.log(`next is ${next}`)
    console.log(re.test(next))
    return re.test(next)
  })
  console.log(`second found is ${found}`)
  const resultlogs = await this.app.client.getMainProcessLogs()
  for (let log of resultlogs) {
    console.dir(log)
  }
  expect(_.isEmpty(found)).to.equal(false)
})

Then(/^a call to open an external url(?:, | to )"(.+?)"(?:|,) (?:should be|is) made/, async function (url) {
  let value = await sendOpenUrlCall(url)
  const resultlogs = await this.app.client.getMainProcessLogs()
  for (let log of resultlogs) {
    console.dir(log)
  }
  const resultlogs1 = await this.app.client.getRendererProcessLogs()
  for (let log of resultlogs1) {
    console.dir(log)
  }
  expect(value).to.equal(true)
})
