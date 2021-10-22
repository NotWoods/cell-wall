pnpm run build -w

Remove-Item -Path "..\cell-wall@pi-deploy\javascript\client\build\" -Recurse
Copy-Item -Path "javascript\client\build" -Destination "..\cell-wall@pi-deploy\javascript\client" -Recurse
Copy-Item -Path "javascript\client\package.json" -Destination "..\cell-wall@pi-deploy\javascript\client" -Force
Copy-Item -Path "javascript\server\build" -Destination "..\cell-wall@pi-deploy\javascript\server" -Recurse -Force
Copy-Item -Path "javascript\server\.gitignore" -Destination "..\cell-wall@pi-deploy\javascript\server" -Force
Copy-Item -Path "javascript\server\package.json" -Destination "..\cell-wall@pi-deploy\javascript\server" -Force
Copy-Item -Path "javascript\types-appium-adb\package.json" -Destination "..\cell-wall@pi-deploy\javascript\types-appium-adb" -Force
Copy-Item -Path "deploy.gitignore" -Destination "..\cell-wall@pi-deploy\.gitignore" -Force
Copy-Item -Path "pnpm-lock.yaml" -Destination "..\cell-wall@pi-deploy" -Force
Copy-Item -Path "pnpm-workspace.yaml" -Destination "..\cell-wall@pi-deploy" -Force

git -C "..\cell-wall@pi-deploy" add .
git -C "..\cell-wall@pi-deploy" commit -m "deploy"
git -C "..\cell-wall@pi-deploy" push
