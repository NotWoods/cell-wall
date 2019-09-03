# Use `source adb-all.sh` to get the adb-all command in the shell

# Run adb command on all connected devices
function adb-all() {
    # adb devices -l: Print all devices, along with connected ports. Works with devices missing a serial no.
    # egrep '(device|emulator) usb': Select lines with devices listed. (ex: SERIAL device usb:2-1.4.6)
    # awk '{print $3}': Select the third item in the line, seperated by whitespace
    # xargs ...: Run adb for each line piped in
    adb devices -l | egrep '(device|emulator) usb' | awk '{print $3}' | xargs -t -I% -n1 -P5 \
          adb -s % "$@"
}
