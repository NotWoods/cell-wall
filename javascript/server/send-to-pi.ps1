$Server = 'pi@raspberrypi.local'
$Dest = '~/cell-wall-deploy'

scp $PSScriptRoot/package.dist.json ${Server}:${Dest}/package.json
scp -r $PSScriptRoot/assets/ ${Server}:${Dest}/assets/
scp -r $PSScriptRoot/dist/ ${Server}:${Dest}/dist/
