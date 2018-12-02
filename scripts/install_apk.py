from os.path import expanduser

from adb.adb_commands import AdbCommands
from adb.sign_pythonrsa import PythonRSASigner

# KitKat+ devices require authentication
signer = PythonRSASigner(expanduser('~/.android/adbkey'))


def _connect_all():
    """Connect to and yield every device available in ADB."""
    for handle in AdbCommands.Devices():
        device = AdbCommands()
        device.ConnectDevice(serial=handle.serial_number,
                             port_path=handle.port_path, rsa_keys=[signer])
        yield device


def install_apk(apk_path):
    for device in _connect_all():
        device.Install(apk_path)


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser(
        description="Install an APK to all connected Android devices")
    parser.add_argument('apk_path', help='Path to APK file.')

    args = parser.parse_args()

    install_apk(args.apk_path)
