pnpm run build -w
Copy-Item -Path "javascript\client\build" -Destination "..\cell-wall@pi-deploy\javascript\client" -Recurse -Force
Copy-Item -Path "javascript\client\package.json" -Destination "..\cell-wall@pi-deploy\javascript\client" -Force
Copy-Item -Path "javascript\server\build" -Destination "..\cell-wall@pi-deploy\javascript\server" -Recurse -Force
Copy-Item -Path "javascript\server\.gitignore" -Destination "..\cell-wall@pi-deploy\javascript\server" -Force
Copy-Item -Path "javascript\server\package.json" -Destination "..\cell-wall@pi-deploy\javascript\server" -Force
Copy-Item -Path "javascript\.gitignore" -Destination "..\cell-wall@pi-deploy\javascript" -Force
Copy-Item -Path "pnpm-lock.yaml" -Destination "..\cell-wall@pi-deploy" -Force
Copy-Item -Path "pnpm-workspace.yaml" -Destination "..\cell-wall@pi-deploy" -Force