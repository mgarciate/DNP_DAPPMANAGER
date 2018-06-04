const shellSync_default = require('./shell')
const fs = require('fs')
const getPath = require('./getPath')
const validate = require('./validate')

const TARGET_PACKAGE_NAME = "dappmanager.dnp.dappnode.eth"


function createRestartPatch(params, docker) {

  return async function restartPatch(IMAGE_NAME) {

    const DOCKERCOMPOSE_RESTART_PATH = getPath.DOCKERCOMPOSE('restart.dnp.dappnode.eth', params, true)
    const DOCKERCOMPOSE_DATA = `version: '3.4'

services:
    restart.dnp.dappnode.eth:
        image: ${IMAGE_NAME}
        container_name: DAppNodeTool-restart.dnp.dappnode.eth
        volumes:
            - '/usr/src/dappnode/DNCORE/docker-compose-dappmanager.yml:/usr/src/app/DNCORE/docker-compose-dappmanager.yml'
            - '/usr/local/bin/docker-compose:/usr/local/bin/docker-compose'
            - '/var/run/docker.sock:/var/run/docker.sock'
        entrypoint:
            docker-compose -f /usr/src/app/DNCORE/docker-compose-dappmanager.yml up -d`

    validate.path(DOCKERCOMPOSE_RESTART_PATH)
    await fs.writeFileSync(DOCKERCOMPOSE_RESTART_PATH, DOCKERCOMPOSE_DATA)

    await docker.compose.up(DOCKERCOMPOSE_RESTART_PATH)

  }
}

module.exports = createRestartPatch