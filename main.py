from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
import googlemaps

# Load variables from .env file
load_dotenv()
api_key = os.getenv("GOOGLE_MAPS_API_KEY")

gmaps = googlemaps.Client(key=api_key)

app = Flask(__name__)

# function to retrieve current coordinates (longitude and latitude)
# returns dict in form {'location': {'lat': LATITUDE, 'lng': LONGITUDE}, 'accuracy': radius of exact location circle in meters
def get_location(api_key):
    url = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + api_key
    data = {
        'considerIp': 'true'
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        location_data = response.json()
        return location_data
    else:
        return None

# geocode address to coordinates (neccessary even for coordinates already)
def geocode_address(address):
    url = f"https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": address,
        "key": api_key
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data["results"]:
            location = data["results"][0]["geometry"]["location"]
            return location["lat"], location["lng"]
        else:
            print("Address not found!")
            return None
    else:
        print(f"Error: {response.status_code}")
        return None


def get_route(origin, destination):
    url = f"https://routes.googleapis.com/directions/v2:computeRoutes"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.legs.steps.navigationInstruction.instructions"
    }
    body = {
        "origin": {"location": {"latLng": {"latitude": origin[0], "longitude": origin[1]}}},
        "destination": {"location": {"latLng": {"latitude": destination[0], "longitude": destination[1]}}},
        "travelMode": "WALK",
        "computeAlternativeRoutes": True
    }

    response = requests.post(url, headers=headers, json=body)
    if response.status_code == 200:
        data = response.json()
        if "routes" in data:
            route = data["routes"][0]
            print(f"Distance: {route['distanceMeters']} meters")
            print(f"Duration: {route['duration']}")
            for step in route["legs"][0]["steps"]:
                print(step["navigationInstruction"]["instructions"])
        else:
            print("No routes found!")
    else:
        print(f"Error: {response.status_code}, {response.text}")

def get_street_view_image(latitude, longitude, api_key, heading=0, fov=90, pitch=0, size="600x400"):
    url = f"https://maps.googleapis.com/maps/api/streetview"
    params = {
        "size": size,  # Width x Height of the image
        "location": f"{latitude},{longitude}",
        "heading": heading,  # Direction the camera is facing
        "fov": fov,  # Field of view in degrees
        "pitch": pitch,  # Up or down angle of the camera
        "key": api_key
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        # Save the image locally or return the image URL
        with open("street_view_image.jpg", "wb") as file:
            file.write(response.content)
        print("Street View image saved successfully!")
    else:
        print(f"Error retrieving Street View image: {response.status_code}")

# retrieves google sattelite image based on lat, long
# size 17 good for whole campus, 18/19 most likely good for personal area view
def get_satellite_image(latitude, longitude, api_key, zoom=19, size="600x400"):
    url = f"https://maps.googleapis.com/maps/api/staticmap"
    params = {
        "center": f"{latitude},{longitude}",
        "zoom": zoom, # zoom level (1 = world view, 20+ = building level)
        "size": size, # width x height of image
        "maptype": "satellite", # type view, satellite view
        "key": api_key
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        # save locally
        with open("satellite_image.jpg", "wb") as file:
            file.write(response.content)
        print("Satellite image saved successfully.")
    else:
        print(f"Error retrieving satellite image: {response.status_code}")
'''
# Example use (athletic building to woodland
origin = geocode_address("40.114825,-75.111566")
destination = geocode_address("40.116130,-75.111437")

get_route(origin, destination)

addressTest = 'Yosemite National Park, CA'
def test(address):
    response_geocode = gmaps.geocode(address)
    print(response_geocode)

test(addressTest)

location = get_location(api_key)
print(f"Location Data: {location}")

get_satellite_image("40.115869","-75.110101", api_key)
get_street_view_image("40.115869","-75.110101", api_key)
'''
'''
# example streetview use
if location:
    latitude = location["location"]["lat"]
    longitude = location["location"]["lng"]
    print(f"Retrieved location: Latitude {latitude}, Longitude {longitude}")
    get_street_view_image(latitude, longitude, api_key)
    get_satellite_image(latitude, longitude, api_key)
else:
    print("Could not retrieve location.")
'''

# Flask endpoint to get location
@app.route('/api/location', methods=['GET'])
def location_endpoint():
    location_data = get_location()
    if location_data:
        return jsonify(location_data)
    else:
        return jsonify({"error": "Failed to retrieve location"}), 500

# Flask endpoint to geocode address
@app.route('/api/geocode', methods=['GET'])
def geocode_endpoint():
    address = request.args.get('address')
    if not address:
        return jsonify({"error": "Address is required"}), 400
    coordinates = geocode_address(address)
    if coordinates:
        return jsonify({"latitude": coordinates[0], "longitude": coordinates[1]})
    else:
        return jsonify({"error": "Failed to geocode address"}), 500

# Flask endpoint to get route
@app.route('/api/route', methods=['POST'])
def route_endpoint():
    data = request.get_json()
    origin = data.get('origin')
    destination = data.get('destination')

    if not origin or not destination:
        return jsonify({"error": "Origin and destination are required"}), 400

    route = get_route(origin, destination)
    return jsonify(route)

@app.route('/api/streetview', methods=['GET'])
def streetview_endpoint():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    heading = request.args.get('heading', default=0, type=int)
    fov = request.args.get('fov', default=90, type=int)
    pitch = request.args.get('pitch', default=0, type=int)
    size = request.args.get('size', default="600x400")

    if not latitude or not longitude:
        return jsonify({"error": "Latitude and Longitude are required"}), 400

    try:
        get_street_view_image(latitude, longitude, api_key, heading, fov, pitch, size)
        return jsonify({"message": "Street View image retrieved and saved successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/satellite', methods=['GET'])
def satellite_endpoint():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    zoom = request.args.get('zoom', default=17, type=int)
    size = request.args.get('size', default="600x400")

    if not latitude or not longitude:
        return jsonify({"error": "Latitude and Longitude are required"}), 400

    try:
        get_satellite_image(latitude, longitude, api_key, zoom, size)
        return jsonify({"message": "Satellite image retrieved and saved successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)