import matplotlib.pyplot as plt
import matplotlib.image as mpimg

# Load your grid image
img = mpimg.imread('C:/Users/mrami/Desktop/DCIM/FloorPlans/Converted/Woodland 0979008-2_page_1_grid.png')

def onclick(event):
    if event.xdata is not None and event.ydata is not None:
        print(f"🟡 Clicked at: ({int(event.xdata)}, {int(event.ydata)})")

fig, ax = plt.subplots()
ax.imshow(img)
cid = fig.canvas.mpl_connect('button_press_event', onclick)

plt.title("Click to get coordinates")
plt.show()