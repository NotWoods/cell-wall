from re import compile
from os.path import expanduser

from adb.adb_commands import AdbCommands
from adb.sign_pythonrsa import PythonRSASigner


WAKEFULLNESS = compile(r"mWakefulness=(\w+)")
KEYCODE_POWER = 26


class AndroidDevice:
    def __init__(self, signer, serial=None, port_path=None):
        self.device = AdbCommands()
        self.device.ConnectDevice(
            serial=serial, port_path=port_path, rsa_keys=[signer])

    def install(self, apk_path):
        self.device.Install(apk_path)

    def trigger_button(self, keycode):
        """Trigger a button on the connected device.

        Params
        ------
        keycode: number of the key to use
        """
        self.device.Shell(f"input keyevent {keycode}")

    def is_on(self):
        """Checks if the screen is on."""
        powerstate = self.device.StreamingShell(f"dumpsys power")
        buffer = ''
        wakefulness = None
        for chunk in powerstate:
            buffer += chunk
            match = WAKEFULLNESS.match(buffer)
            if match:
                wakefulness = match.group(1)
                break
        return wakefulness == "Awake"


class DeviceHelper:
    def __init__(self):
        # KitKat+ devices require authentication
        self.signer = PythonRSASigner(expanduser('~/.android/adbkey'))
        self.devices = []
        self.refresh_devices()

    def refresh_devices(self):
        """Connect to every device available in ADB."""
        self.devices = [
            AndroidDevice(signer=self.signer, serial=handle.serial_number,
                          port_path=handle.port_path)
            for handle in AdbCommands.Devices()
        ]

    def install(self, apk_path):
        """Install APK from the given location on the server."""
        for device in self.devices:
            device.install(apk_path)

    def trigger_button(self, keycode):
        """Trigger a button on every connected device."""
        for device in self.devices:
            device.trigger_button(keycode)

    def turn_on(self):
        for device in self.devices:
            if not device.is_on():
                device.trigger_button(KEYCODE_POWER)

    def turn_off(self):
        for device in self.devices:
            if device.is_on():
                device.trigger_button(KEYCODE_POWER)
