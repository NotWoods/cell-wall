from device_helper import DeviceHelper


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser(
        description="Install an APK to all connected Android devices")
    parser.add_argument('apk_path', help='Path to APK file.')

    args = parser.parse_args()

    DeviceHelper().install(args.apk_path)
