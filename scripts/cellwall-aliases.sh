source ./adb-all.sh

# Open home screen.
alias cellwall-home=adb-all shell input keyevent KEYCODE_HOME

# Toggle power for all devices.
alias cellwall-power=adb-all shell input keyevent KEYCODE_POWER

# Display website on CellWall.
# Usage: `cellwall-web https://example.com`
alias cellwall-web=adb-all shell am start -a "com.tigeroakes.cellwallclient.VIEW" -d

# Open Corsica on CellWall.
alias cellwall-corsica=cellwall-web http://192.168.50.249:8080
