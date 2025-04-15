import tkinter as tk
from tkinter import ttk, messagebox, Canvas, PhotoImage
import sqlite3
import heapq

# Database loading
def load_map_from_db(conn):
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM buildings")
    buildings = cursor.fetchall()

    cursor.execute("SELECT id, building_id, level, floor_plan FROM areas")
    areas = cursor.fetchall()

    cursor.execute("SELECT id, area_id, room_number, name, x_coord, y_coord FROM rooms")
    rooms = cursor.fetchall()

    return buildings, areas, rooms

# Simple Dijkstra algorithm
def dijkstra(graph, start, end):
    queue = [(0, start)]
    visited = {}
    while queue:
        cost, node = heapq.heappop(queue)
        if node in visited:
            continue
        visited[node] = cost
        if node == end:
            break
        for neighbor, weight in graph.get(node, []):
            if neighbor not in visited:
                heapq.heappush(queue, (cost + weight, neighbor))

    if end not in visited:
        return None

    # Reconstruct path
    path = [end]
    while path[-1] != start:
        for neighbor, weight in graph.get(path[-1], []):
            if visited.get(neighbor, float('inf')) + weight == visited[path[-1]]:
                path.append(neighbor)
                break
    return list(reversed(path))

# Basic mock adjacency graph for pathfinding
def build_mock_graph(rooms):
    # For now, assume adjacent room IDs are connected (fake adjacency)
    graph = {}
    sorted_rooms = sorted(rooms, key=lambda r: r[2])  # room_number
    for i in range(len(sorted_rooms) - 1):
        a = sorted_rooms[i][0]  # room id
        b = sorted_rooms[i + 1][0]
        graph.setdefault(a, []).append((b, 1))
        graph.setdefault(b, []).append((a, 1))
    return graph

# GUI
class MapGUI(tk.Tk):
    def __init__(self, conn):
        super().__init__()
        self.conn = conn
        self.title("Building Guide")
        self.geometry("800x600")

        self.buildings, self.areas, self.rooms = load_map_from_db(conn)
        self.graph = build_mock_graph(self.rooms)

        self.selected_area_id = None
        self.room_coords = {room[0]: (room[4], room[5]) for room in self.rooms}  # id: (x, y)

        self.create_widgets()

    def create_widgets(self):
        self.combo_start = ttk.Combobox(self, values=[f"{r[2]} ({r[0]})" for r in self.rooms])
        self.combo_end = ttk.Combobox(self, values=[f"{r[2]} ({r[0]})" for r in self.rooms])
        self.btn_path = ttk.Button(self, text="Find Path", command=self.find_path)

        self.canvas = Canvas(self, bg='white', width=600, height=500)

        self.combo_start.pack(pady=5)
        self.combo_end.pack(pady=5)
        self.btn_path.pack(pady=5)
        self.canvas.pack(pady=10)

        self.draw_rooms()

    def draw_rooms(self):
        for room in self.rooms:
            room_id, _, room_number, _, x, y = room
            if x is not None and y is not None:
                self.canvas.create_oval(x - 5, y - 5, x + 5, y + 5, fill='gray')
                self.canvas.create_text(x + 10, y, text=room_number, anchor='w', font=('Arial', 8))

    def find_path(self):
        try:
            start_id = int(self.combo_start.get().split("(")[-1].strip(")"))
            end_id = int(self.combo_end.get().split("(")[-1].strip(")"))
        except:
            messagebox.showerror("Error", "Invalid room selection.")
            return

        path = dijkstra(self.graph, start_id, end_id)
        if not path:
            messagebox.showinfo("No Path", "No path found.")
            return

        self.canvas.delete("path")
        for i in range(len(path) - 1):
            x1, y1 = self.room_coords[path[i]]
            x2, y2 = self.room_coords[path[i + 1]]
            self.canvas.create_line(x1, y1, x2, y2, fill='blue', width=3, tags="path")

# Main run
if __name__ == "__main__":
    conn = sqlite3.connect("woodland.db") 
    app = MapGUI(conn)
    app.mainloop()
