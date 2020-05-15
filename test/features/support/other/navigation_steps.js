import { When, Then } from 'cucumber'
import { applyFnToIdOrClassSelectorFromLabel } from '../page-objects/selectors.js'
import { sendOpenUrlCall } from '../page-objects/helpers'

const highlightColor = 'rgba(181,209,255,0.3)'

Then(/^the column that the cursor is in should be displayed/, async function () {
  let found = false
  const selector = '.editor.handsontable'
  let responses
  responses = await this.app.client.element(selector).getCssProperty('.ht_master table tr td', 'backgroundColor')
  for (const next of responses) {
    if (next.value === highlightColor) {
      found = true
    }
  }
  if (!found) {
    console.log('Unable to find matching background color, trying class...')
    responses = await this.app.client.waitForVisible('.current.highlight')
  }
  return responses
})

When(/^(?:the |a |)"(.+?)" (?:button|panel) is (?:clicked|invoked)$/, async function (label) {
  await applyFnToIdOrClassSelectorFromLabel(this.app, 'click', label, this.pageTimeout)
})

When(/^(?:the |a |)(?:button|panel): "(.+?)" is (?:clicked|invoked)$/, async function (label) {
  await applyFnToIdOrClassSelectorFromLabel(this.app, 'click', label, this.pageTimeout)
})

When(/^(?:the |a |)(?:logo): "(.+?)" is (?:clicked|invoked)$/, async function (label) {
  // const test1 = await this.app.client.windowHandles()
  // console.dir(test1)
  const result = await sendOpenUrlCall('http://advance.qld.gov.au')
  console.log(`result is ${result}`)
  console.dir(result)
  const resultlogs = await this.app.client.getMainProcessLogs()
  for (let log of resultlogs) {
    console.dir(log)
  }
  const resultlogs1 = await this.app.client.getRenderProcessLogs()
  for (let log of resultlogs1) {
    console.dir(log)
  }
  // const aboutProperties = await this.app.client.waitForVisible('#aboutProperties', this.pageShortTimeout)
  //   .element(`img[src$='static/img/${label}.png']`)
  //   .click()
  // console.log('testing complex selector...')
  // console.dir(aboutProperties)
  const test = await this.app.client.windowHandles()
  console.dir(test.value[0])
  console.dir(test.value[1])
  expect(true).is(false)
})
