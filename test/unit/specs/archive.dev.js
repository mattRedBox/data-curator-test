import { generateDataPackage } from '@/exportPackage'
import store from '@/store'
import { globalBefore, restoreRemoteGetGlobal, globalStubTab } from '../helpers/globalHelper.js'
import fs from 'fs-extra'
import os from 'os'
import * as unzip from 'unzipper'
import { remote } from 'electron'
import path from 'path'
import Vuex from 'vuex'
import { stubSimpleTabStore } from '../helpers/storeHelper'
import { registerHot, resetHot, stubHotInDocumentDom } from '../helpers/hotHelper'

// sinonTest doesn't seem to work with complex callbacks
// const sinonTest = require('sinon-test')(sinon, {useFakeTimers: false})

describe('file actions', function () {
  before(function () {
    globalBefore()
  })
  let sandbox
  beforeEach(function () {
    sandbox = sinon.createSandbox()
    stubHotInDocumentDom(sandbox)
  })
  afterEach(function () {
    resetHot(sandbox)
    sandbox.restore()
  })

  describe('create data package with frictionless table descriptor text', function () {
    const tempFile = `${os.tmpdir()}/myArchive.zip`
    const packageJson = fs.readJsonSync('test/fixtures/basic_package_descriptor.json')
    const packageText = JSON.stringify(packageJson, null, 4)
    const csvFile1 = 'test/fixtures/test1.csv'
    it('creates an archive package from a simple table descriptor', function (done) {
      // globalStubTab(sandbox)
      stubTabFor1File(sandbox, csvFile1)
      let hot = registerHot()
      let stubbedStore = new Vuex.Store(stubSimpleTabStore(hot))
      stubbedStore.state.filenames = [csvFile1]
      let storeStubbedGetters = sandbox.stub(store, 'getters').get(function getterFn () {
        return stubbedStore.getters
      })
      const unpacked = `${os.tmpdir()}/myArchive`
      let output = generateDataPackage(tempFile, packageText)
      output.on('close', () => {
        fs.createReadStream(tempFile).pipe(unzip.Extract({ path: unpacked }))
          .on('error', (err) => {
            done(err)
          })
          .on('close', function () {
            fs.readFile(`${unpacked}/datapackage.json`, 'utf-8', function (err, d) {
              if (err) {
                restoreRemoteGetGlobal()
                fs.removeSync(unpacked)
                done(err)
              } else {
                try {
                  expect(d).to.deep.equal(packageText)
                } catch (err) {
                  done(err)
                } finally {
                  restoreRemoteGetGlobal()
                  fs.removeSync(unpacked)
                  done()
                }
              }
            })
          })
      })
    })
  })

  function stubTabFor1File (sandbox, fileLocation, extension = '.csv') {
    const activeFilename = path.basename(fileLocation)
    console.log(`active filename: ${activeFilename}`)
    const activeTitle = path.basename(fileLocation, extension)
    console.log(`active title: ${activeTitle}`)
    return sandbox.stub(remote, 'getGlobal')
      .withArgs('tab')
      .returns({ activeTitle: activeTitle, activeFilename: activeFilename, filenames: [fileLocation] })
  }
})
