import json
import time

def update_json_file(file_path, key, value):
    # Read the existing data from the JSON file
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Update the data
    data["rotation"][key] = value

    # Write the updated data back to the JSON file
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

i = 0
while 1:
    i += 0.01
    update_json_file("../client/public/data.json", "x", i)
    update_json_file("../client/public/data.json", "y", i)
    update_json_file("../client/public/data.json", "z", i)
    time.sleep(0.1)