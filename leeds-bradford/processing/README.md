# Instructions

### **Important Note - we've devised a better method to calculate the emissions (using the Eurocontrol Small Emitters tool data). I haven't yet updated this code and it's slightly convoluted so I wouldn't recommend using it. I will update it soon but in the meantime see the [ODI Leeds flight data repo](https://github.com/odileeds/flight-data) for updated instructions and the new data format.**

## Setup
1. Clone this repo
2. You'll probably want to delete all the files in the data folder to avoid confusion.
3. Ensure python 3.7 is installed.
4. Navigate to the repository, and run the following commands:
```bash
python3 -m venv env
source env/bin/activate
pip3 install -r processing/requirements.txt
```

### Config
If you want to run the script for an airport other than Leeds Bradford, you'll need to find a source of flight data and update the config.json file accordingly. The data should be in json format, and contain the following fields:
* Flight Number
* Date & Time (should be ISO 8601 format)
* Airline
* Destination name
* Destination IATA code

These fields can be named anything, as long as you specify the field names in the config.json file.

### FlightAware (optional)
I'm currently using [FlightAware's](https://flightaware.com) API to determine the aircraft model for each flight - if you want to use this, you'll need to set up an account, get an API key, and create a file in the processing folder named "fa_auth.json" in the following format:
```json
{
    "User": "your username",
    "Key": "your key"
}
```
If this file doesn't exist, the program will still work, but the emission estimates will be much less accurate as it will use average emission factors rather than aircraft-specific figures.


## Use
After you've done the above, you should just be able run the following command:
```bash
python3 processing/main.py
```


