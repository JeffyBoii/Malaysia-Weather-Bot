# Changelog

All notable changes to Malaysia Weather Bot are listed here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Nothing yet. Ideas and requests are welcome in the [issues](../../issues).

## [1.1.0] - 2026-10-19

### Added
- **Approximate Haze Index** in `!weather`, shown as a colour-coded US AQI from Good 🟢 to Hazardous 🟤. It is based on modelled air quality data, so it may differ from the official Malaysian API reading.
- **`!ethan`** sends the Ethan picture.
- **Location nicknames** such as `kl`, `jb`, `kk`, `ipoh`, `kuching` and `georgetown`.

### Changed
- `!help` now lists the `!ethan` command.
- `!weather` still works if air quality data can't be loaded. The Haze Index is simply left out.

## [1.0.0] - 2026-10-18

First public release.

### Added
- **`!weather [location]`** shows the current weather: temperature, "feels like" temperature, condition, humidity and wind speed.
- **`!hourly [location]`** shows a 12-hour forecast with temperature, condition and chance of rain for each hour.
- **`!help`** lists all commands.
- **All Malaysian states and federal territories**, plus Langkawi. If you don't give a location, the bot uses Kuala Lumpur.
- **Free weather data** from Open-Meteo, so no weather API key is needed.
- Clear error messages for invalid locations and failed requests.

[Unreleased]: ../../compare/v1.1.0...HEAD
[1.1.0]: ../../releases/tag/v1.1.0
[1.0.0]: ../../releases/tag/v1.0.0
