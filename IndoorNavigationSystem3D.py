import heapq
import math
import matplotlib.pyplot as plt
from matplotlib import colors
from matplotlib.widgets import Button
import numpy as np
from mpl_toolkits.mplot3d import Axes3D  # For 3D plotting

def normalize_angle(angle):
    # Normalize an angle to the [-pi, pi] range.
    while angle > math.pi:
        angle -= 2 * math.pi
    while angle < -math.pi:
        angle += 2 * math.pi
    return angle

class IndoorNavigationSystem3D:
    def __init__(self):
        self.current_position = None
        self.destination = None
        self.building_map = {}
        self.path = []
        self.room_labels = {}
        # Initial facing direction (radians) - facing north/up is pi/2.
        self.facing = math.pi / 2

    def initialize_position_by_room(self, room_name):
        for (x, y, z), label in self.room_labels.items():
            if label == room_name and (x, y) not in self.building_map['obstacles'].get(z, {}):
                self.current_position = (x, y, z)
                print(f"Starting at door of {room_name} → ({x}, {y}, {z})")
                return
        print(f"No accessible door found for room '{room_name}'")

    def set_destination_by_room(self, room_name):
        for (x, y, z), label in self.room_labels.items():
            if label == room_name and (x, y) not in self.building_map['obstacles'].get(z, {}):
                self.destination = (x, y, z)
                print(f"Destination set to {room_name} at ({x}, {y}, {z})")
                return
        print(f"Room '{room_name}' not found or no accessible door.")

    def load_building_map(self, map_data):
        self.building_map = map_data
        self.room_labels = map_data['room_labels']

    def calculate_path(self):
        if not self.current_position or not self.destination:
            return None
        open_list = []
        heapq.heappush(open_list, (0, self.current_position))
        came_from = {}
        g_score = {self.current_position: 0}
        f_score = {self.current_position: self.heuristic(self.current_position, self.destination)}
        closed_set = set()
        while open_list:
            _, current = heapq.heappop(open_list)
            if current == self.destination:
                self.path = self.reconstruct_path(came_from, current)
                return self.path
            closed_set.add(current)
            for neighbor in self.get_neighbors(current):
                if neighbor in closed_set:
                    continue
                tentative_g = g_score[current] + self.calculate_distance(current, neighbor)
                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + self.heuristic(neighbor, self.destination)
                    heapq.heappush(open_list, (f_score[neighbor], neighbor))
        return None

    def get_neighbors(self, position):
        neighbors = []
        x, y, z = position
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x + dx, y + dy
                if self.is_valid_position(nx, ny, z):
                    neighbors.append((nx, ny, z))
        for conn in self.building_map['vertical_connections']:
            if (x, y, z) == (conn['x'], conn['y'], conn['from']):
                neighbors.append((conn['x'], conn['y'], conn['to']))
        return neighbors

    def is_valid_position(self, x, y, z):
        floor = self.building_map['floors'].get(z)
        if not floor:
            return False
        if x < 0 or y < 0 or x >= floor['width'] or y >= floor['height']:
            return False
        return (x, y) not in self.building_map['obstacles'].get(z, {})

    def heuristic(self, a, b):
        # Multiply floor (z) by 3 for vertical spacing.
        return math.dist((a[0], a[1], a[2] * 3), (b[0], b[1], b[2] * 3))

    def calculate_distance(self, a, b):
        return self.heuristic(a, b)

    def reconstruct_path(self, came_from, current):
        path = [current]
        while current in came_from:
            current = came_from[current]
            path.append(current)
        return path[::-1]

    def get_next_direction(self):
        if not self.path or len(self.path) < 2:
            return "You have reached your destination"
        current = self.current_position
        next_pos = self.path[1]
        dx = next_pos[0] - current[0]
        dy = next_pos[1] - current[1]
        dz = next_pos[2] - current[2]
        if dz > 0:
            return f"Go up to floor {next_pos[2]}"
        if dz < 0:
            return f"Go down to floor {next_pos[2]}"
        angle_next = math.atan2(dy, dx)
        relative_angle = normalize_angle(angle_next - self.facing)
        relative_deg = math.degrees(relative_angle)
        if abs(relative_deg) <= 22.5:
            instruction = "Move forward"
        elif 22.5 < relative_deg <= 67.5:
            instruction = "Move forward left"
        elif 67.5 < relative_deg <= 112.5:
            instruction = "Move left"
        elif 112.5 < relative_deg <= 157.5:
            instruction = "Move backward left"
        elif relative_deg > 157.5 or relative_deg <= -157.5:
            instruction = "Move backward"
        elif -67.5 >= relative_deg > -112.5:
            instruction = "Move right"
        elif -22.5 > relative_deg >= -67.5:
            instruction = "Move forward right"
        elif -112.5 >= relative_angle > -157.5:
            instruction = "Move backward right"
        else:
            instruction = "Move in that direction"
        return instruction

# 2D Floor Viewer remains unchanged
class FloorViewer:
    def __init__(self, path, room_labels, obstacles, floors, building_map):
        self.path = path
        self.room_labels = room_labels
        self.obstacles = obstacles
        self.floors = floors
        self.building_map = building_map
        self.floor_keys = sorted(floors.keys())
        self.index = 0  # current floor view index
        # Navigation index to step through the path
        self.nav_index = 0
        # Initial facing direction: facing north/up (π/2)
        self.current_facing = math.pi / 2

        self.fig, self.ax = plt.subplots(figsize=(11, 7))
        # Button to switch floors.
        self.floor_button_ax = self.fig.add_axes([0.85, 0.01, 0.1, 0.05])
        self.floor_button = Button(self.floor_button_ax, "Next Floor")
        self.floor_button.on_clicked(self.next_floor)
        # Button to step to the next navigation instruction.
        self.instr_button_ax = self.fig.add_axes([0.70, 0.01, 0.1, 0.05])
        self.instr_button = Button(self.instr_button_ax, "Next Instruction")
        self.instr_button.on_clicked(self.next_instruction)

        # Initial draw on the current floor.
        self.show_floor(self.floor_keys[self.index])
        plt.show()

    def next_floor(self, event):
        self.index = (self.index + 1) % len(self.floor_keys)
        self.ax.clear()
        self.show_floor(self.floor_keys[self.index])
        self.fig.canvas.draw_idle()

    def next_instruction(self, event):
        # If we've reached the destination, do nothing.
        if self.nav_index >= len(self.path) - 1:
            print("Navigation complete: You have reached your destination.")
            return

        current = self.path[self.nav_index]
        next_step = self.path[self.nav_index + 1]
        dz = next_step[2] - current[2]

        # Handle vertical transitions.
        if dz > 0:
            instruction = f"Go up to floor {next_step[2]}"
            # For vertical moves, we clear the facing (there is no arrow in the 2D view)
            self.current_facing = None
        elif dz < 0:
            instruction = f"Go down to floor {next_step[2]}"
            self.current_facing = None
        else:
            # For horizontal moves, compute new facing and relative instruction.
            dx = next_step[0] - current[0]
            dy = next_step[1] - current[1]
            angle_next = math.atan2(dy, dx)
            # Compute relative angle (using the global normalize_angle function)
            relative_angle = normalize_angle(angle_next - self.current_facing)
            relative_deg = math.degrees(relative_angle)
            if abs(relative_deg) <= 22.5:
                instruction = "Move forward"
            elif 22.5 < relative_deg <= 67.5:
                instruction = "Move forward left"
            elif 67.5 < relative_deg <= 112.5:
                instruction = "Move left"
            elif 112.5 < relative_deg <= 157.5:
                instruction = "Move backward left"
            elif relative_deg > 157.5 or relative_deg <= -157.5:
                instruction = "Move backward"
            elif -67.5 >= relative_deg > -112.5:
                instruction = "Move right"
            elif -22.5 > relative_deg >= -67.5:
                instruction = "Move forward right"
            elif -112.5 >= relative_angle > -157.5:
                instruction = "Move backward right"
            else:
                instruction = "Move in that direction"
            # Update the facing to the new horizontal direction.
            self.current_facing = angle_next

        # Advance navigation index.
        self.nav_index += 1
        # Clear and redraw the current floor.
        self.ax.clear()
        self.show_floor(self.floor_keys[self.index], instruction=instruction)
        self.fig.canvas.draw_idle()
        print(f"Step {self.nav_index}: {instruction}")

    def show_floor(self, z, instruction=None):
        # Create the grid representation.
        width, height = self.floors[z]['width'], self.floors[z]['height']
        grid = np.zeros((height, width), dtype=int)
        for (ox, oy) in self.obstacles.get(z, {}):
            grid[oy][ox] = 1
        for (x, y, f) in self.path:
            if f == z:
                grid[y][x] = 2

        cmap = colors.ListedColormap(["#e8e8e8", "#001f3f", "#39cccc"])
        self.ax.imshow(grid, cmap=cmap, origin='lower')
        self.ax.set_title(f"Floor {z} - LAB 3 Blueprint View", fontsize=14, fontweight='bold')
        self.ax.set_xticks([])
        self.ax.set_yticks([])

        # Plot room labels.
        shown = set()
        for (x, y, f), label in self.room_labels.items():
            if f == z and (x, y) not in self.obstacles[z] and (x, y) not in shown:
                self.ax.plot(x, y, 'o', color='orange', markersize=3)
                self.ax.text(x + 0.5, y + 0.5, label, fontsize=7, color='black')
                shown.add((x, y))
        # Indicate vertical connections (stairs) with an icon.
        for (sx, sy) in set((c['x'], c['y']) for c in self.building_map['vertical_connections'] if c['from'] == z):
            self.ax.text(sx, sy, "🪜", fontsize=12, ha='center', va='center', color='darkred')

        # If the current navigation step is on this floor, draw the user’s arrow icon.
        if self.nav_index < len(self.path):
            curr_pos = self.path[self.nav_index]
            if curr_pos[2] == z and self.current_facing is not None:
                x_arrow = curr_pos[0] + 0.5  # Center in the cell.
                y_arrow = curr_pos[1] + 0.5
                # Draw a small arrow indicating the facing direction.
                arrow_dx = 0.5 * math.cos(self.current_facing)
                arrow_dy = 0.5 * math.sin(self.current_facing)
                self.ax.arrow(x_arrow, y_arrow, arrow_dx, arrow_dy,
                              head_width=0.3, head_length=0.3, fc='red', ec='red')

        # Optionally display the current instruction as overlay text.
        if instruction is not None:
            self.ax.text(0.05, 0.95, f"Instruction: {instruction}",
                         transform=self.ax.transAxes,
                         fontsize=12, color='blue', verticalalignment='top',
                         bbox=dict(facecolor='white', alpha=0.6))
# --- Revised: 3D Map Viewer with Walls and Doors ---
# --- Revised: 3D Map Viewer with Enhanced Room Label Readability ---
class ThreeDMapViewer:
    """
    3D view of the building:
      - Each floor is plotted as a horizontal plane at z = floor_number * floor_scale.
      - Obstacles (rooms) are plotted as gray squares.
      - Walls are drawn as black line segments along obstacle boundaries.
      - Doors are marked with green markers.
      - Room labels (one per room) and vertical connections are displayed.
      - Room labels are now drawn with increased font size, bold text, and a white background for better visibility.
    """
    def __init__(self, map_data, path):
        self.map_data = map_data
        self.path = path
        self.floors = map_data["floors"]
        self.obstacles = map_data["obstacles"]
        self.room_labels = map_data["room_labels"]
        self.doors = map_data.get("doors", {})  # New dictionary of door coordinates per floor.
        self.vertical_connections = map_data["vertical_connections"]
        # Scale factor to separate floors vertically.
        self.floor_scale = 10
        self.plot()

    def plot(self):
        fig = plt.figure(figsize=(12, 9))
        ax = fig.add_subplot(111, projection='3d')
        
        # For each floor, plot obstacles, walls, doors and room labels.
        for floor, floor_info in self.floors.items():
            z_val = floor * self.floor_scale
            # Plot obstacles as gray squares.
            obs_x, obs_y = [], []
            floor_obs = self.obstacles.get(floor, {})
            for coord in floor_obs.keys():
                try:
                    x, y = coord
                    obs_x.append(x)
                    obs_y.append(y)
                except Exception:
                    continue
            if obs_x and obs_y:
                ax.scatter(obs_x, obs_y, zs=z_val, marker='s', color='gray', alpha=0.5, s=10)
            
            # Compute and plot wall segments.
            wall_segments = []
            floor_width = floor_info["width"]
            floor_height = floor_info["height"]
            for (x, y) in floor_obs.keys():
                # North edge.
                if (y + 1 >= floor_height) or ((x, y+1) not in floor_obs):
                    wall_segments.append(((x, y+1), (x+1, y+1)))
                # South edge.
                if (y - 1 < 0) or ((x, y-1) not in floor_obs):
                    wall_segments.append(((x, y), (x+1, y)))
                # East edge.
                if (x + 1 >= floor_width) or ((x+1, y) not in floor_obs):
                    wall_segments.append(((x+1, y), (x+1, y+1)))
                # West edge.
                if (x - 1 < 0) or ((x-1, y) not in floor_obs):
                    wall_segments.append(((x, y), (x, y+1)))
            for segment in wall_segments:
                (x1, y1), (x2, y2) = segment
                ax.plot([x1, x2], [y1, y2], [z_val, z_val], color='black', linewidth=2)
            
            # Plot door markers in green.
            floor_doors = self.doors.get(floor, set())
            door_x, door_y = [], []
            for (x, y) in floor_doors:
                door_x.append(x + 0.5)  # center the marker in the cell
                door_y.append(y + 0.5)
            if door_x and door_y:
                ax.scatter(door_x, door_y, zs=z_val, marker='o', color='green', s=30, label="Door")
            
            # Annotate room labels once per room with enhanced readability.
            annotated_rooms = set()
            for key, label in self.room_labels.items():
                try:
                    x, y, f = key
                except Exception:
                    continue
                if f == floor and label not in annotated_rooms:
                    # Increase font size, use bold text, and add a white semi-transparent background.
                    ax.text(x + 0.5, y + 0.5, z_val, label,
                            fontsize=10, color='black', fontweight='bold',
                            bbox=dict(facecolor='white', edgecolor='none', alpha=0.8))
                    annotated_rooms.add(label)
                    
        # Plot the navigation path (if available).
        if self.path:
            path_x = [node[0] + 0.5 for node in self.path]  # center in cell
            path_y = [node[1] + 0.5 for node in self.path]
            path_z = [node[2] * self.floor_scale for node in self.path]
            ax.plot(path_x, path_y, path_z, color='blue', marker='o', linewidth=2)
        
        # Draw vertical connections (stairs) as red lines.
        for conn in self.vertical_connections:
            floor_from = conn['from']
            floor_to = conn['to']
            z_from = floor_from * self.floor_scale
            z_to = floor_to * self.floor_scale
            x = conn['x']
            y = conn['y']
            ax.plot([x, x], [y, y], [z_from, z_to], color='red', marker='^', markersize=5)
        
        # Set axis limits.
        all_x, all_y = [], []
        for floor in self.floors.keys():
            for (x, y) in self.obstacles.get(floor, {}).keys():
                all_x.append(x)
                all_y.append(y)
        if all_x and all_y:
            ax.set_xlim(min(all_x) - 5, max(all_x) + 5)
            ax.set_ylim(min(all_y) - 5, max(all_y) + 5)
        max_floor = max(self.floors.keys())
        ax.set_zlim(0, (max_floor + 1) * self.floor_scale)

        ax.set_xlabel("X")
        ax.set_ylabel("Y")
        ax.set_zlabel("Floor (scaled)")
        ax.set_title("3D Building Map View")
        plt.show()


# --- Updated Map Generator with Doors ---
def generate_lab3_map():
    # Define building dimensions.
    map_data = {
        "floors": {1: {"width": 110, "height": 40}, 2: {"width": 110, "height": 40}},
        "vertical_connections": [
            {"x": 5, "y": 22, "from": 1, "to": 2},
            {"x": 97, "y": 22, "from": 1, "to": 2},
            {"x": 5, "y": 22, "from": 2, "to": 1},
            {"x": 97, "y": 22, "from": 2, "to": 1}
        ],
        "obstacles": {1: {}, 2: {}},
        "room_labels": {},
        "doors": {1: set(), 2: set()}  # New: record door coordinates.
    }

    # ===== Floor 1: Procedural Room Generation =====
    horizontal_gap = 3   # gap in blocks between rooms horizontally
    vertical_gap = 3     # gap between rows
    room_width = 6
    room_height = 4
    start_x = 10
    top_row_y = 20
    bottom_row_y = top_row_y + room_height + vertical_gap

    for i in range(10):
        x1 = start_x + i * (room_width + horizontal_gap)
        y1 = top_row_y if i % 2 == 0 else bottom_row_y
        room_name = f"Room 10{i+1}"
        for dx in range(room_width):
            for dy in range(room_height):
                px, py = x1 + dx, y1 + dy
                map_data["obstacles"][1][(px, py)] = True
                map_data["room_labels"][(px, py, 1)] = room_name
        # Determine door coordinate.
        door_x = x1 + 2
        door_y = y1 + room_height if i % 2 == 0 else y1 - 1
        # Remove the door cell from obstacles and record it.
        map_data["obstacles"][1].pop((door_x, door_y), None)
        map_data["room_labels"][(door_x, door_y, 1)] = room_name
        map_data["doors"][1].add((door_x, door_y))

    # ===== Floor 2: Updated Room Placement =====
    rooms_floor_2 = [
        {"name": "Room 201 - CLASS LAB", "w": 8, "h": 6},
        {"name": "Room 202 - RESEARCH LAB", "w": 8, "h": 6},
        {"name": "Room 203 - FACULTY OFFICE", "w": 6, "h": 4},
        {"name": "Room 204 - COLLABORATION", "w": 10, "h": 6},
        {"name": "Room 205 - CLASS LAB", "w": 8, "h": 6},
        {"name": "Room 206 - RESEARCH LAB", "w": 8, "h": 6},
        {"name": "Room 207 - STORAGE", "w": 6, "h": 4},
        {"name": "Room 208 - MEETING", "w": 10, "h": 6},
        {"name": "Room 209 - OFFICE", "w": 6, "h": 4},
        {"name": "Room 210 - LAB", "w": 8, "h": 6}
    ]
    lower_row_y = 20
    upper_row_y = lower_row_y + 6 + vertical_gap
    x_cursor = 10
    for room in rooms_floor_2[:7]:
        room["x"] = x_cursor
        room["y"] = upper_row_y
        room["door_y"] = upper_row_y - 1
        x_cursor += room["w"] + horizontal_gap
    x_cursor = 10
    for room in rooms_floor_2[7:]:
        room["x"] = x_cursor
        room["y"] = lower_row_y
        room["door_y"] = lower_row_y + room["h"]
        x_cursor += room["w"] + horizontal_gap

    for room in rooms_floor_2:
        name = room["name"]
        x0, y0, w, h = room["x"], room["y"], room["w"], room["h"]
        door_y = room["door_y"]
        for dx in range(w):
            for dy in range(h):
                px, py = x0 + dx, y0 + dy
                map_data["obstacles"][2][(px, py)] = True
                map_data["room_labels"][(px, py, 2)] = name
        door_x = x0 + w // 2
        map_data["obstacles"][2].pop((door_x, door_y), None)
        map_data["room_labels"][(door_x, door_y, 2)] = name
        map_data["doors"][2].add((door_x, door_y))

    return map_data

# Run System
if __name__ == "__main__":
    nav = IndoorNavigationSystem3D()
    map_data = generate_lab3_map()
    nav.load_building_map(map_data)
    nav.initialize_position_by_room("Room 101")
    nav.set_destination_by_room("Room 210 - LAB")
    path = nav.calculate_path()
    if path:
        print("\n📍 Navigation Directions:")
        for i in range(len(path) - 1):
            nav.current_position = path[i]
            nav.path = path[i:]
            direction = nav.get_next_direction()
            print(f"From {nav.current_position}: {direction}")
            dx = path[i+1][0] - path[i][0]
            dy = path[i+1][1] - path[i][1]
            if dx or dy:
                nav.facing = math.atan2(dy, dx)
        nav.current_position = path[-1]
        print(f"At {nav.current_position}: You have reached your destination.")
        FloorViewer(path, nav.room_labels, map_data["obstacles"], map_data["floors"], map_data)
        ThreeDMapViewer(map_data, path)
    else:
        print("No path found.")
